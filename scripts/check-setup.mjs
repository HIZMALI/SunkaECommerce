import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
for (const mode of ["development", "production"]) {
  const filename = `setup-verification-${mode}.db`;
  const resolved = path.resolve("prisma", filename);
  if (fs.existsSync(resolved))
    throw new Error(
      "Verification path already exists; preserve it and use a fresh name.",
    );
  const env = {
    ...process.env,
    DATABASE_URL: `file:./${filename}`,
    DEMO_MODE: "true",
    NODE_ENV: mode,
  };
  const result = spawnSync(process.execPath, ["scripts/setup.mjs"], {
    env,
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status || 1);
  const verify = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
  import {PrismaClient} from '@prisma/client';
  const client=new PrismaClient();
  const mode=process.env.NODE_ENV;
  try {
   const [products,users,orders,quotes,applications]=await Promise.all([client.product.count(),client.user.count(),client.order.count(),client.quoteRequest.count(),client.wholesaleApplication.count()]);
   if(products!==21||users!==(mode==='production'?0:3)||orders!==(mode==='production'?0:2)||quotes!==(mode==='production'?0:3)||applications!==(mode==='production'?0:2))throw new Error('Unexpected clean setup counts.');
   console.log(JSON.stringify({mode,products,users,orders,quotes,applications,verified:true}));
  }finally{await client.$disconnect();}
 `,
    ],
    { env, stdio: "inherit" },
  );
  if (verify.status !== 0) process.exit(verify.status || 1);
  fs.unlinkSync(resolved);
}
