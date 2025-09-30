"use server"

import { getInfo } from "@my-project/common/db";
import Info from "../components/info";

export default async function App() {
  const info = await getInfo();
  const value = info?.value ?? 0;
  return (<>
    <h1>Hello Next.js!</h1>
    <Info value={ value } />
  </>)
}
