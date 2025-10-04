// test-upload.js
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const localFile = path.resolve("./teste.jpg");
  if (!fs.existsSync(localFile)) {
    console.error("Coloque um arquivo 'teste.jpg' na raiz do projeto e rode novamente.");
    process.exit(1);
  }
  const fileStream = fs.createReadStream(localFile);
  const remotePath = `public/teste-node-${Date.now()}.jpg`;

  const { data, error } = await supabase.storage.from("uploads").upload(remotePath, fileStream);

  console.log("data:", data);
  console.log("error:", error);
}

run();
