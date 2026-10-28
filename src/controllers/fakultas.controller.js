import FakultasModel from '../model/fakultas.model.js'
import { StoreFakultasSchema, UpdateFakultasSchema } from '../schemas/fakultas.schema.js'
import { apiResponse, apiResponseValidation } from '../utils/response.js'


class FakultasController {
  static async index(req, res) {
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

    const allowedSortFields = ["name", "createdAt", "updatedAt"]
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
   
     
    
    const [listFakultas, totalData] = await Promise.all([
      FakultasModel.find(filter)
        .select({
          _id: 1,
          name: 1, 
          createdAt: 1, 
          updatedAt: 1, 
        })
        .sort(sortOption)
        .skip(skip)
        .limit(perPage),

      FakultasModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalData/perPage)

    return apiResponse({ 
      res, 
      status: 200, 
      data: {
        items: listFakultas,
        pagination: {
          totalData,
          totalPages,
          currentPage,
          perPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        }
      }
    });
  }

  static async show(req, res) {
    const fakultasId = req.params.id
    const fakultas = await FakultasModel.findById(fakultasId)

    if (!fakultas) {
      return apiResponse({ res, status: 404, message: 'Fakultas tidak ditemukan' })
    }

    return apiResponse({ res, status: 200, data: fakultas })
  }

  static async store(req, res) {
    const result = StoreFakultasSchema.safeParse(req.body)
        if(!result.success){
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
    const {name}=result.data

    if (!name) {
      return apiResponse({ res, status: 400, message: 'Nama fakultas wajib diisi' })
    }

    const newFakultas = await FakultasModel.create({ name })
    return apiResponse({ res, status: 201, data: newFakultas })
  }

  static async update(req, res) {
    const fakultasId = req.params.id
    const result = UpdateFakultasSchema.safeParse(req.body)
        if(!result.success){
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }

    const {name}=result.data

    const exists = await FakultasModel.exists({ _id: fakultasId })
    if (!exists) {
      return apiResponse({ res, status: 404, message: 'Fakultas tidak ditemukan' })
    }

    const updateFakultas = await FakultasModel.findOneAndUpdate(
      { _id: fakultasId },
      { name },
      { new: true }
    )

    return apiResponse({ res, status: 200, data: updateFakultas })
  }

  static async delete(req, res) {
    const fakultasId = req.params.id

    const exists = await FakultasModel.exists({ _id: fakultasId })
    if (!exists) {
      return apiResponse({ res, status: 404, message: 'Fakultas tidak ditemukan' })
    }

    await FakultasModel.findOneAndDelete({ _id: fakultasId })
    return apiResponse({ res, status: 200, message: 'Fakultas berhasil dihapus', data: null })
  }
}

export default FakultasController