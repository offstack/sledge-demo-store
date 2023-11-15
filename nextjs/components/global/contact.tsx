"use client";

import { Button, CardImage, Input } from "components/global";
import { FormEvent, useState } from "react";

export default function Contact() {
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact-us", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      setFormSubmitted(false);
    } else {
      setFormSubmitted(true);
    }

    return data;
  }
  return (
    <div className="flex gap-[50px] flex-col lg:flex-row">
      <CardImage
        image={"/images/businessowner-always-keep-contact-with-customer_1.png"}
        title=""
        descripton=""
      />
      <div className="flex flex-col flex-auto lg:mt-[20px]">
        <div className="">
          <h1 className="font-bold text-[24px] md:text-[48px] md:leading-[52.8px] mb-[12px]">
            Contact us
          </h1>
          <p className="max-w-[594px] font-inter font-medium text-[12px] md:text-[16px] leading-[25.6px] tracking-[-0.32px] text-dark4">
            We value your feedback, inquiries, and the opportunity to connect
            with you. Your satisfaction and questions are important to us.
            Please don't hesitate to get in touch with our dedicated team.
          </p>
        </div>
        {formSubmitted ? (
          <p className="w-fit m-auto text-center text-[16px] md:text-[25px] leading-[26px] tracking-[-0.02em] text-sledge-color-text-secondary-1">
            Thank you for your message. We will get back to you shortly.
          </p>
        ) : (
          <ContactForm onSubmit={onSubmit} error={error} />
        )}
      </div>
    </div>
  );
}

function ContactForm({ onSubmit, error }: { onSubmit: any; error: any }) {
  const yyyyMmDd = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={onSubmit}
      className="mt-[20px] md:mt-[40px] gap-[40px] flex flex-col"
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-[20px] md:gap-[28px] sm:grid-cols-6 md:col-span-2">
          <Input
            label="Name"
            type="text"
            name="name"
            placeholder="Name"
            colSpan={"sm:col-span-3"}
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            colSpan={"sm:col-span-3"}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder='Email "example@gmail.com"'
            colSpan={"col-span-full"}
          />
          <Input
            label="Add your message"
            type="textarea"
            name="message"
            placeholder="Write your message"
            colSpan={"col-span-full"}
          />
          <input type="text" hidden name="date" defaultValue={yyyyMmDd} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[20px] md:gap-[24px]">
        {error && (
          <div>
            <p className="w-fit text-[12px] md:text-[16px] leading-[26px] tracking-[-0.02em] text-sledge-color-primary-red-2">
              There was an error submitting your message. Please try again.
            </p>
            <p className="text-red">{error}</p>
          </div>
        )}
        <div className="lg:w-fit flex items-center text-white justify-center gap-x-6 lg:justify-start hover:opacity-70 transition duration-200 mt-0 !w-fit">
          <Button text="Send" />
        </div>
      </div>
    </form>
  );
}
