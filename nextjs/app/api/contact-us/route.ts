import { createAdminClient } from "lib/shopify/create-admin-client";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
  const formData = await request.formData();

  const fields = Object.fromEntries(formData);

  if (!fields.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!fields.phone) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!fields.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!fields.message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const { form, error } = await createContactFormEntry({ fields });

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ form });
}

async function createContactFormEntry({ fields }: { fields: any }) {
  const METAOBJECT_UPSERT = `#graphql
      mutation metaobjectUpsert($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject {
            id
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const metaobjectHandle = {
    handle: "contact-form",
    type: "contact_form",
  };

  const formHandle = slugify(Date.now() + fields.name);

  const metaobject = {
    capabilities: {
      publishable: {
        status: "ACTIVE",
      },
    },
    fields: [
      {
        key: "name",
        value: fields.name,
      },
      {
        key: "phone",
        value: fields.phone,
      },
      {
        key: "email",
        value: fields.email,
      },
      {
        key: "message",
        value: fields.message,
      },
      {
        key: "date",
        value: fields.date,
      },
    ],
    handle: formHandle,
  };

  const { admin } = createAdminClient({
    privateAdminToken: process.env.PRIVATE_ADMIN_API_TOKEN,
    storeDomain: process.env.NEXT_PUBLIC_STORE_URL,
    adminApiVersion: process.env.PRIVATE_ADMIN_API_VERSION || "2023-07",
  });

  const { metaobjectUpsert } = await admin(METAOBJECT_UPSERT, {
    variables: { handle: metaobjectHandle, metaobject },
  });

  if (metaobjectUpsert.userErrors.length > 0) {
    const error = metaobjectUpsert.userErrors[0];
    return { form: null, error };
  }

  return { form: metaobjectUpsert.metaobject, error: null };
}
