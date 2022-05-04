using System.Xml.Serialization;
using Data = DataLayer;
using Entity = EntityLayer;

namespace BusinessLayer
{
    public class Sale
    {
        private readonly Data.Sale _db = new Data.Sale();

        public bool Create(Entity.Sale sale, out string message)
        {
            string saleDetail;
            using (var stringwriter = new System.IO.StringWriter())
            {
                var serializer = new XmlSerializer(sale.SaleDetails.GetType());
                serializer.Serialize(stringwriter, sale.SaleDetails);
                saleDetail = stringwriter.ToString();
            }
            saleDetail = saleDetail.Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>\r\n", "");
            saleDetail = saleDetail.Replace("xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"", "");
            saleDetail = saleDetail.Replace("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\r\n", "");
            saleDetail = saleDetail.Replace("\r\n", "");
            saleDetail = saleDetail.Replace("<ArrayOfSaleDetail", "<ArrayOfSaleDetail>");

            return _db.Create(sale, saleDetail, out message);
        }
    }
}
