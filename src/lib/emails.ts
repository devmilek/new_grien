import { CreateEmailOptions, Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options: Omit<CreateEmailOptions, "from">) => {
  const { text = "", ...rest } = options;

  const { data, error } = await resend.emails.send({
    from: "Grien <grien@devmilek.com>",
    text,
    ...rest,
  });

  if (error) {
    return console.error("Error sending email:", error);
  }

  return data;
};
