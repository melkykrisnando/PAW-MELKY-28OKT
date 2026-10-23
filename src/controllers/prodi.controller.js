import mongoose from "mongoose"
import FakultasModel from "../model/fakultas.model.js"
import { StoreProdiSchema, UpdateProdiSchema } from "../schemas/prodi.schema.js"
import { apiResponse, apiResponseValidation } from "../utils/response.js"
import ProdiModel from "../model/prodi.model.js"

class ProdiController{
    static async index(req,res){
        const { 
      search, 
      sortBy = "createdAt", 
      sort,
      page = 1,
      limit = 10,
    } = req.query; 

    const currentPage = Math.max(1, parseInt(page, 10) || 1)
    const perPage = Math.max(1, parseInt(limit, 10) || 1)
    const skip = (currentPage-1) * perPage

    const allowedSortFields = ["kode", "nama_prodi", "createdAt", "updatedAt"]
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"

    const filter = {};
    const sortOption = { 
      [sortField]: sort === "desc" ? -1 : 1, 
    }; 

    if (search) { 
      filter.name = { 
      $regex: search, 
      $options: "i", 
    };}

        const listProdi = await Promise.all([
            ProdiModel.find(filter)
            .select({
                _id: 1,
                kode:1,
                nama_prodi: 1, 
                fakultas:1,
                createdAt: 1, 
                updatedAt: 1,
            })
            .sort(sortOption)
            .skip(skip)
            .limit(perPage)
            .populate("fakultas")
        ])
        return apiResponse({
            res,
            status: 200,
            message: "List Prodi",
            data : listProdi
        })
    }

    static async show(req,res){}

    static async store(req,res){
        const result = StoreProdiSchema.safeParse(req.body)
        
        if(!result.success){
            return apiResponseValidation({
                res,
                errors : result.error
            })
        }
        const{kode,nama_prodi,fakultas_id} = result.data

        const isExists = await FakultasModel.exists({
            _id : new mongoose.Types.ObjectId(fakultas_id)
        })

        if (!isExists){
            return apiResponse({
                res,
                status: 404,
                message : "Fakultas tidak ada"
            })
        }
        const newProdi = await ProdiModel.create({
            kode,
            nama_prodi,
            fakultas : fakultas_id
        });
        return apiResponse({
            res,
            status: 201,
            message: "Prodi Berhasil di buat",
            data: newProdi
        })
    }

    static async update(req,res){
        const prodiId = req.params.id;
        const result = UpdateProdiSchema.safeParse(req.body)
        if(!result.success){
            return apiResponseValidation({
                res,
                errors : result.error
            })
        }
        const prodi = await ProdiModel.findById(prodiId)
        if(!prodi){
            return apiResponse({
                res,
                status: 404,
                message: "Prodi Tidak Ditemukan",
                data: null
            })
        }
        const{kode, nama_prodi, fakultas_id} = result.data

        if (fakultas_id) {
        const isExists = await FakultasModel.exists({
        _id: new mongoose.Types.ObjectId(fakultas_id)
        });

        if (!isExists) {
          return apiResponse({ 
            res, 
            status: 404, 
            message: "Fakultas tidak ada", 
            data: null 
            });
        }
        }

        const updatedProdi = await ProdiModel.findByIdAndUpdate(prodiId,{ 
            kode, 
            nama_prodi, 
            fakultas: fakultas_id 
            },{ new: true }).populate("fakultas") ;
            
            return apiResponse({ 
                res, 
                status: 200, 
                message: "Prodi berhasil diperbarui", 
                data: updatedProdi 
            });
        }

    static async delete(req,res){
        const prodiId = req.params.id;
        const prodi = await ProdiModel.findByIdAndDeleted(prodiId);
        if (!prodi) {
        return apiResponse({ 
            res, 
            status: 404, 
            message: "Prodi tidak ada", 
            data: null 
        });
        }
        return apiResponse({ 
            res, 
            status: 200, 
            message: "Prodi berhasil dihapus", 
            data: null 
        });
    }
}

export default ProdiController