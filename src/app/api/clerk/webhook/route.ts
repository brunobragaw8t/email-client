import { z } from "zod";
import { db } from "~/server/db";

const createUserSchema = z.object({
  id: z.string(),
  email_addresses: z.array(z.object({
    email_address: z.string(),
  })).nonempty(),
  first_name: z.string(),
  last_name: z.string(),
  image_url: z.string(),
}).strip();

export const POST = async (req: Request) => {
  const parsed = createUserSchema.safeParse(await req.json())

  if (typeof parsed.data === 'undefined') {
    console.log(parsed.error);
    throw new Error('Zod validation error');
  }

  const data = parsed.data;

  const id = data.id;
  const email = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;

  await db.user.create({ data: { id, email, firstName, lastName, imageUrl } });

  return new Response('OK', { status: 200 })
}
