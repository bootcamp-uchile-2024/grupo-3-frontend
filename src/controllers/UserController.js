const User = require('../models/User'); 

// Controlador para eliminar un usuario por ID
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Encuentra y elimina el usuario por ID
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

module.exports = { deleteUser };