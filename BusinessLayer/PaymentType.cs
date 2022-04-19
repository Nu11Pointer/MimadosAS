using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class PaymentType
    {
        private readonly Data.PaymentType _Db = new Data.PaymentType();

        public bool Create(Entity.PaymentType paymentType, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(paymentType.Name) || string.IsNullOrWhiteSpace(paymentType.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Create(paymentType, out message);
        }

        public List<Entity.PaymentType> Read()
        {
            return _Db.Read();
        }

        public bool Update(Entity.PaymentType paymentType, out string message)
        {
            // Validar Nombre
            if (string.IsNullOrEmpty(paymentType.Name) || string.IsNullOrWhiteSpace(paymentType.Name))
            {
                message = "El campo \"Nombre\" no puede ser vacio.";
                return false;
            }

            return _Db.Update(paymentType, out message);
        }

        public bool Delete(Entity.PaymentType paymentType, out string message)
        {
            return _Db.Delete(paymentType, out message);
        }
    }
}
