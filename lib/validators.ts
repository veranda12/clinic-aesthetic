import { z } from "zod";

// Accepts either an absolute URL (remote image) or a local path such as
// "/media/xxx.png" produced by the upload route. Plain z.string().url() would
// reject the local upload paths.
export function imageSrc(message = "Gambar tidak valid") {
  return z
    .string()
    .min(1, message)
    .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/"), message);
}
