import z from "zod";

export const StoreFakultasSchema = z.object({
    name : z.string().trim().min(3,"NAMA FAKULTAS WAJIB 3 KARAKTER")


})

export const UpdateFakultasSchema = z.object({
    name : z.string().trim().min(3,"NAMA FAKULTAS WAJIB 3 KARAKTER")
})