import User from '../models/userModel.js';

export const getAllUsers = async (req,res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "You are not the admin" });
        }

        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get users' });
    }
};

export const deleteUser = async (req,res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "You are not the admin" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

export const makeCompaney  = async (req,res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "ليس لديك صلاحيات" });
        }

        const userId = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isCompany: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.status(200).json({ message: "تم تحويل المستخدم إلى شركة بنجاح",user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء العملية",error });
    }
};

export const makeUnCompaney = async (req,res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "ليس لديك صلاحيات" });
        }

        const userId = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isCompany: false },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.status(200).json({ message: "تم إزالة صفة الشركة من المستخدم بنجاح",user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء العملية",error });
    }
};
