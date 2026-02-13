
const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,nex)).catch((error)=>next(error))
    }
}

module.exports = asyncHandler