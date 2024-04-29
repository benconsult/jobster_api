
const Job = require('../models/Jobs')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) =>{
    //console.log(req.query);
    const {search, status,jobType, sort} = req.query;
    //set up query object for search
    const queryObject = {
      createdBy: req.user.userId
    }
    if(search){
       queryObject.position = {$regex:search, $options:'i'}
    }
    //for status
    if(status && status !== 'all'){
        queryObject.status = status
    }
    //for job type - default will be all
    if(jobType && jobType !== 'all'){
        queryObject.status = status
    }
    //since we are going to chain, we remove await 
    let result = Job.find(queryObject);

    const jobs = await result
    res.status(StatusCodes.OK).json({jobs})
}

const getJob = async (req, res) =>{
    const {user:{userId}, params:{id: jobId},} = req
    const job = await Job.findOne({ _id:jobId, createdBy: userId })
    if(!job){
        throw new NotFoundError(`No job with ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) =>{
    req.body.createdBy =  req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) =>{
    const { body: { company, position }, user:{userId}, params:{id: jobId},} = req
    if(company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({ _id:jobId, createdBy: userId }, req.body, {new:true, runValidators:true })
    if(!job){
        throw new NotFoundError(`No job with ${jobId}`)
    }

    res.status(StatusCodes.OK).json({ job })
   
}

const deleteJob = async (req, res) =>{
    const {user:{userId}, params:{id: jobId},} = req
    const job  = await Job.findByIdAndRemove({ _id: jobId, createdBy:userId})
    res.status(StatusCodes.OK).send()
}

module.exports = {
   getAllJobs,getJob,createJob,updateJob,deleteJob
}