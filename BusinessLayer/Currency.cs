using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Currency
    {
        private readonly Data.Currency _Db = new Data.Currency();

        public bool Create(Entity.Currency currency, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(currency.Name) || string.IsNullOrWhiteSpace(currency.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(currency, out message);
        }

        public List<Entity.Currency> Read()
        {
            return _Db.Read();
        }

        public bool Update(Entity.Currency currency, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(currency.Name) || string.IsNullOrWhiteSpace(currency.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(currency, out message);
        }

        public bool Delete(Entity.Currency currency, out string message)
        {
            return _Db.Delete(currency, out message);
        }
    }
}
