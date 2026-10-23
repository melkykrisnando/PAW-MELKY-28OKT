import z from "zod"

export const StoreProdiSchema = z.object({
    kode: z.string().trim().min(2,'Kode Prodi Minimal 2 Karakter'),
    nama_prodi: z.string().trim().min(3,'Kode Prodi Minimal 3 Karakter'),
    fakultas_id: z.string().trim().min(24,'Kode Prodi Minimal 24 Karakter'),
})

export const UpdateProdiSchema = z.object({
    kode: z.string().trim().min(2,'Kode Prodi Minimal 2 Karakter'),
    nama_prodi: z.string().trim().min(3,'Kode Prodi Minimal 3 Karakter'),
    fakultas_id: z.string().trim().min(24,'Kode Prodi Minimal 24 Karakter'),
})