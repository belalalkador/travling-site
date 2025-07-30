import mongoose from 'mongoose';

const DBconnect=  async ()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/travling_databaes');
        console.log('MongoDB connected ✅ ');
      } catch (error) {
        console.error('MongoDB connection failed ❌', error);
        process.exit(1);
      }
};
export default DBconnect;