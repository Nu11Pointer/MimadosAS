using System.Web.Mvc;
using Business = BusinessLayer;
using Entity = EntityLayer;

namespace AdminPresentationLayer.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Read()
        {
            var data = new Business.User().Read();
            var json = new { data };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ReadById(int employeeId)
        {
            var json = new
            {
                data = new Business.User().ReadById(employeeId)
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Entity.User user)
        {
            var result = new Business.User().Create(user, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(Entity.User user)
        {
            var result = new Business.User().Update(user, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(Entity.User user)
        {
            var result = new Business.User().Delete(user, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ResendPassword(Entity.User user)
        {
            var result = new Business.User().ResendPassword(user, out string message);
            var json = new { result, message };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LogIn(Entity.User user)
        {
            var result = new Business.User().Verification(user, out string _);
            Session["User"] = new Business.User().ReadByEmail(user.EmployeeEmail.Email);
            var json = new { result };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LogOut()
        {
            Session["User"] = null;
            return RedirectToAction("Index", "Login");
        }

        [HttpGet]
        public JsonResult Me()
        {
            return Json(Session["User"], JsonRequestBehavior.AllowGet);
        }
    }
}