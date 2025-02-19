// app/layout-header.js (or any server component)
import Header from "./header";
import { checkUser } from "@/lib/checkUser";

export default async function LayoutHeader() {
  const user = await checkUser();

  return <Header user={user} />;
}