import invariant from 'tiny-invariant';
import slugify from 'slugify';
import {json, type ActionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionArgs) {
  const formData = await request.formData();

  const fields = Object.fromEntries(formData);

  invariant(fields.name, 'Name is required');
  invariant(fields.phone, 'Phone is required');
  invariant(fields.email, 'Email is required');
  invariant(fields.message, 'Message is required');

  const {form, error} = await createContactFormEntry({fields, context});

  if (error) {
    return json({error}, {status: 400});
  }

  return json({form});
}

async function createContactFormEntry({
  fields,
  context,
}: {
  fields: any;
  context: any;
}) {
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
    handle: 'contact-form',
    type: 'contact_form',
  };

  const formHandle = slugify(Date.now() + fields.name);
  const metaobject = {
    capabilities: {
      publishable: {
        status: 'ACTIVE',
      },
    },
    fields: [
      {
        key: 'name',
        value: fields.name,
      },
      {
        key: 'phone',
        value: fields.phone,
      },
      {
        key: 'email',
        value: fields.email,
      },
      {
        key: 'message',
        value: fields.message,
      },
      {
        key: 'date',
        value: fields.date,
      },
    ],
    handle: formHandle,
  };

  const {metaobjectUpsert} = await context.admin(METAOBJECT_UPSERT, {
    variables: {handle: metaobjectHandle, metaobject},
  });

  if (metaobjectUpsert.userErrors.length > 0) {
    const error = metaobjectUpsert.userErrors[0];
    return {form: null, error};
  }

  return {form: metaobjectUpsert.metaobject, error: null};
}
