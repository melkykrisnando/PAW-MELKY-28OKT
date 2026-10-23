import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        kode:{
            type: String,
            required : true,
            unique : true
        },
        nama_prodi: {
        type: String,
            required : true,
            unique : true
        },
        fakultas: {
            type: mongoose.Schema.ObjectId,
            ref : "fakultas",
            required : true
        }
    },
    {
        timestamps: true,
    },

);

const ProdiModel = mongoose.model("Prodi", schema)
export default ProdiModel