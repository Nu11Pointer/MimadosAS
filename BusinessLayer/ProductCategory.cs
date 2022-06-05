using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class ProductCategory
    {
        private readonly Data.ProductCategory _Db = new Data.ProductCategory();

        public bool Create(Entity.ProductCategory productCategory, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(productCategory.Name) || string.IsNullOrWhiteSpace(productCategory.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(productCategory, out message);
        }

        public List<Entity.ProductCategory> Read()
        {
            return _Db.Read();
        }

        public List<Entity.ProductCategory> ReadActive()
        {
            return _Db.Read().Where(c => c.Active).ToList();
        }

        public bool Update(Entity.ProductCategory productCategory, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(productCategory.Name) || string.IsNullOrWhiteSpace(productCategory.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(productCategory, out message);
        }

        public bool Delete(Entity.ProductCategory productCategory, out string message)
        {
            return _Db.Delete(productCategory, out message);
        }
    }
}
