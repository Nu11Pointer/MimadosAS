var user;

document.addEventListener('DOMContentLoaded', function () {
    jQuery.ajax({
        url: '/User/Me',
        type: "GET",
        success: function (data) {
            user = data;
            $("#UserName").text(user.Employee.Name + " (" + user.Employee.EmployeePosition.Name + ")")
        },
        error: function (_) {
        }
    });
});
