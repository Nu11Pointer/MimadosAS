using System.Collections.Generic;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class ProductMeasurementUnit
    {
        private readonly Data.ProductMeasurementUnit _Db = new Data.ProductMeasurementUnit();

        public List<Entity.ProductMeasurementUnit> Read()
        {
            return _Db.Read();
        }
    }
}
