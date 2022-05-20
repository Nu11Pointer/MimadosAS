using System.Collections.Generic;
using System.Linq;
using System.Xml.Serialization;
using Data = DataLayer;
using Entity = EntityLayer;


namespace BusinessLayer
{
    public class Purchase
    {
        private readonly Data.Purchase _db = new Data.Purchase();

        public bool Create(Entity.Purchase purchase, out string message, out int id)
        {
            string saleDetail;
            using (var stringwriter = new System.IO.StringWriter())
            {
                var serializer = new XmlSerializer(purchase.PurchaseDetails.GetType());
                serializer.Serialize(stringwriter, purchase.PurchaseDetails);
                saleDetail = stringwriter.ToString();
            }
            saleDetail = saleDetail.Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n", "");
            saleDetail = saleDetail.Replace("xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"", "");
            saleDetail = saleDetail.Replace("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n", "");
            saleDetail = saleDetail.Replace("\r\n", "");
            saleDetail = saleDetail.Replace("<ArrayOfPurchaseDetails", "<ArrayOfPurchaseDetails>");

            return _db.Create(purchase, saleDetail, out message, out id);
        }

        public List<Entity.Purchase> Read()
        {
            return _db.Read();
        }

        public Entity.Purchase ReadById(int id)
        {
            return _db.Read().FirstOrDefault(s => s.Id == id);
        }

        public List<Entity.PurchaseDetails> Detail(int id)
        {
            return _db.Detail(id);
        }
    }
}
