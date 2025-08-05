const { getConnection } = require('../config/database');

// Obtener todas las brigadas
const getAllBrigadas = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.query(`
      SELECT * FROM brigadas 
      WHERE activo = true 
      ORDER BY fecha_registro DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener brigadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las brigadas'
    });
  }
};

// Obtener una brigada por ID
const getBrigadaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.query(`
      SELECT * FROM brigadas 
      WHERE id = $1 AND activo = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Brigada no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener brigada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la brigada'
    });
  }
};

// Crear una nueva brigada
const createBrigada = async (req, res) => {
  try {
    const {
      NombreBrigada,
      CantidadBomberosActivos,
      ContactoCelularComandante,
      EncargadoLogistica,
      ContactoCelularLogistica,
      NumeroEmergenciaPublico
    } = req.body;
    
    const pool = await getConnection();
    const result = await pool.query(`
      INSERT INTO brigadas (
        nombre_brigada, 
        cantidad_bomberos_activos, 
        contacto_celular_comandante, 
        encargado_logistica, 
        contacto_celular_logistica, 
        numero_emergencia_publico
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nombre_brigada
    `, [
      NombreBrigada,
      CantidadBomberosActivos,
      ContactoCelularComandante,
      EncargadoLogistica,
      ContactoCelularLogistica,
      NumeroEmergenciaPublico
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Brigada creada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear brigada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la brigada'
    });
  }
};

// Actualizar una brigada
const updateBrigada = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      NombreBrigada,
      CantidadBomberosActivos,
      ContactoCelularComandante,
      EncargadoLogistica,
      ContactoCelularLogistica,
      NumeroEmergenciaPublico
    } = req.body;
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('NombreBrigada', sql.NVarChar, NombreBrigada)
      .input('CantidadBomberosActivos', sql.Int, CantidadBomberosActivos)
      .input('ContactoCelularComandante', sql.NVarChar, ContactoCelularComandante)
      .input('EncargadoLogistica', sql.NVarChar, EncargadoLogistica)
      .input('ContactoCelularLogistica', sql.NVarChar, ContactoCelularLogistica)
      .input('NumeroEmergenciaPublico', sql.NVarChar, NumeroEmergenciaPublico)
      .query(`
        UPDATE Brigadas 
        SET 
          NombreBrigada = @NombreBrigada,
          CantidadBomberosActivos = @CantidadBomberosActivos,
          ContactoCelularComandante = @ContactoCelularComandante,
          EncargadoLogistica = @EncargadoLogistica,
          ContactoCelularLogistica = @ContactoCelularLogistica,
          NumeroEmergenciaPublico = @NumeroEmergenciaPublico
        WHERE ID = @id AND Activo = 1
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Brigada no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Brigada actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar brigada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la brigada'
    });
  }
};

// Eliminar una brigada (soft delete)
const deleteBrigada = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE Brigadas 
        SET Activo = 0 
        WHERE ID = @id AND Activo = 1
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Brigada no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Brigada eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar brigada:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la brigada'
    });
  }
};

module.exports = {
  getAllBrigadas,
  getBrigadaById,
  createBrigada,
  updateBrigada,
  deleteBrigada
}; 