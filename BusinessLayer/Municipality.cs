using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Municipality
    {
        private readonly Data.Municipality _Db = new Data.Municipality();

        /// <summary>
        /// Crea un Municipio en la tabla Municipios.
        /// </summary>
        /// <param name="municipality">Municipio a crear</param>
        /// <param name="message">Mensaje de error</param>
        /// <returns>
        /// Verdadero si la operación fue exitosa.
        /// </returns>
        public bool Create(Entity.Municipality municipality, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(municipality.Name) || string.IsNullOrWhiteSpace(municipality.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(municipality, out message);
        }

        /// <summary>
        /// Lista todos los Municipios de la tabla Municipality. 
        /// </summary>
        /// <returns>
        /// Una lista de Municipios.
        /// </returns>
        public List<Entity.Municipality> Read()
        {
            return _Db.Read();
        }

        /// <summary>
        /// Lista todos los Municipios de la tabla Municipality que coicidan con el id del departamento especificado.
        /// </summary>
        /// <param name="deparmentId">Id del departamento para filtrar.</param>
        /// <returns>
        /// Una lista de Municipios.
        /// </returns>
        public List<Entity.Municipality> ReadByDepartment(int deparmentId)
        {
            return _Db.Read().Where(m => m.Department.Id == deparmentId).ToList();
        }

        /// <summary>
        /// Actualiza el Municipio brindado por parametros
        /// </summary>
        /// <param name="municipality">Municipio a actualizar</param>
        /// <param name="message">Mensaje de error</param>
        /// <returns>
        /// Verdadero si la operación fue exitosa.
        /// </returns>
        public bool Update(Entity.Municipality municipality, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(municipality.Name) || string.IsNullOrWhiteSpace(municipality.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(municipality, out message);
        }

        /// <summary>
        /// Elimina el Municipio brindado por parametros
        /// </summary>
        /// <param name="municipality">Municipio a eliminar</param>
        /// <param name="message">Mensaje de error</param>
        /// <returns>
        /// Verdadero si la operación fue exitosa.
        /// </returns>
        public bool Delete(Entity.Municipality municipality, out string message)
        {
            return _Db.Delete(municipality, out message);
        }
    }
}
