using System.Collections.Generic;
using System.Linq;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Municipality
    {
        private readonly Data.Municipality _Db = new Data.Municipality();

        public List<Entity.Municipality> Read()
        {
            return _Db.Read();
        }

        public List<Entity.Municipality> ReadByDepartment(int deparmentId)
        {
            return _Db.Read().Where(m => m.Department.Id == deparmentId).ToList();
        }
    }
}
