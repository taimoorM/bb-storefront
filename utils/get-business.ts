import { supabase } from "@/libs/supabase";

export default async function getBusiness(
  subdomain: string | undefined,
  publicKey: string | undefined
) {
  if (!subdomain || !publicKey) {
    throw new Error("No subdomain or publicKey found");
  }

  const { data: business, error } = await supabase
    .from("Business")
    .select("id, subdomain, secretKey, secretKeyId")
    .eq("subdomain", subdomain)
    .eq("publicKey", publicKey)
    .single();

  if (error || !business) {
    throw new Error("Could not find business");
  }

  return business;
}
