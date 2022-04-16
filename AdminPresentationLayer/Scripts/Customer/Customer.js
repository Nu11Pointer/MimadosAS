var customerTable;
var customerObj;
var rowSelected;
var phoneObj;
var phoneTable
var emailObj;
var emailTable

function SetUp() {

    $('#CollapseMenuCustomer').addClass('active');
    $('#collapseTwo').addClass('show');
    $('#CollapseMenuItemCustomer').addClass('active');

    // Show DataTable
    Read();
    DeparmentLoad();

    // Validaciones
    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "El formato correcto es ####-####");
    jQuery.validator.addMethod("email", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
    }, "Debes ingresar un correo electronico valido.");
    Validator();
    ValidatorPhone();
    ValidatorEmail()

    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);

    // Phone
    $("#dataTable tbody").on("click", '.btn-phone', ShowPhoneRead);    
    $("#dataTablePhone tbody").on("click", '.btn-update', ShowPhoneUpdate);
    $("#dataTablePhone tbody").on("click", '.btn-detelete', DeletePhone);

    // Email
    $("#dataTable tbody").on("click", '.btn-email', ShowEmailRead);
    $("#dataTableEmail tbody").on("click", '.btn-update', ShowEmailUpdate);
    $("#dataTableEmail tbody").on("click", '.btn-detelete', DeleteEmail);
}

function ShowCreateModal() {
    $("#IdentitityCardCreate").val("");
    $("#NameCreate").val("");
    $("#SurNameCreate").val("");
    $("#ActiveCreate").val(1);
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#MunicipalityCreate").val($("#MunicipalityCreate option:first").val());
    $("#AddressCreate").val("");
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function DeparmentLoad() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    })
        // .done(MunicipalityOnChange);
}

function MunicipalityOnChange() {

    $("#MunicipalityCreate option").remove();
    $("#MunicipalityUpdate option").remove();

    // Load Selector Municipality
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentCreate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityCreate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentUpdate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityUpdate");
                try {
                    if (customerObj.Municipality.Id != -1) {
                        $("#MunicipalityUpdate").val(customerObj.Municipality.Id);
                        customerObj.Municipality.Id = -1;
                    }
                } catch (e) {}
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function Validator() {
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            },
            SurNameCreate: {
                required: true
            },
            AddressCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio.",
            SurNameCreate: "- El campo \"Apellido\" es obligatorio.",
            AddressCreate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            },
            AddressUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: "- El campo \"Nombre\" es obligatorio.",
            SurNameCreate: "- El campo \"Apellido\" es obligatorio.",
            AddressUpdate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    $("#IdentitityCardUpdate").val(customerObj.IdentityCard);
    $("#NameUpdate").val(customerObj.Name);
    $("#SurNameUpdate").val(customerObj.SurName);
    $("#ActiveUpdate").val(customerObj.Active ? 1 : 0);
    $("#DepartmentUpdate").val(customerObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#AddressUpdate").val(customerObj.Address);
    $("#FormModalUpdate").modal("show"); 
    $("#ErrorUpdate").hide();
}

function Read() {
    customerTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomers',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            //{ "data": "IdentityCard" },
            { "data": "Name" },
            { "data": "SurName" },
            { "data": "Municipality.Department.Name"},
            { "data": "Municipality.Name" }, 
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm btn-phone mr-1 mb-1"><i class="fas fa-phone-alt"></i></button>' +
                    '<button type="button" class="btn btn-info btn-circle btn-sm btn-email mr-1 mb-1"><i class="fas fa-envelope"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    customerObj = {
        "IdentityCard": $("#IdentitityCardCreate").val(),
        "Name": $("#NameCreate").val(),
        "SurName": $("#SurNameCreate").val(),
        "Address": $("#AddressCreate").val(),
        "Municipality": {
            "Id": $("#MunicipalityCreate option:selected").val()
        },
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Customer/CreateCustomer',
        type: "POST",
        data: JSON.stringify({ customer: customerObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log(response);
            customerTable.ajax.reload();
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalCreate").modal("hide");
                customerTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Cliente.", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    customerObj = {
        "Id": customerObj.Id,
        "IdentityCard": $("#IdentitityCardUpdate").val(),
        "Name": $("#NameUpdate").val(),
        "SurName": $("#SurNameUpdate").val(),
        "Address": $("#AddressUpdate").val(),
        "Municipality": {
            "Id": $("#MunicipalityUpdate option:selected").val()
        },
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Customer/UpdateCustomer',
        type: "POST",
        data: JSON.stringify({ customer: customerObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalUpdate").modal("hide");
                customerTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el cliente.", response.message, "error");
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Delete() {
    console.log("aqui esto")

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    swal({
        title: "Eliminar Cliente",
        text: "¿Estas Seguro que Deseas Eliminar Este Cliente?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/Customer/DeleteCustomer',
                type: "POST",
                data: JSON.stringify({ customer: customerObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        customerTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar el cliente.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

function ShowPhoneRead() {
    $("#FormModalPhone").modal("show");

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    if (phoneTable != null) {
        phoneTable.destroy();
    }

    phoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomerPhonesByCustomerId',
            type: "POST",
            data: { customerId: customerObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "PhoneNumber" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowPhoneCreate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneCreate").modal("show");

    $("#PhoneCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#ErrorPhoneCreate").hide();
}

function ValidatorPhone() {

    $("#CreatePhoneForm").validate({
        rules: {
            PhoneCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneCreate: { required: "- El campo \"Telefono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdatePhoneForm").validate({
        rules: {
            PhoneUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneUpdate: { required: "- El campo \"Telefono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowPhoneCreate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneCreate").modal("show");

    $("#PhoneCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#ErrorPhoneCreate").hide();
}

function CreatePhone() {

    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Customer":customerObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Customer/CreateCustomerPhone',
        type: "POST",
        data: JSON.stringify({ customerPhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                phoneTable.ajax.reload();
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneCreate").modal("hide");
                $("#FormModalPhone").modal("show");
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalPhoneCreate").modal("show");
                });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowPhoneUpdate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#IdPhoneUpdate").val(phoneObj.Id);
    $("#PhoneUpdate").val(phoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(phoneObj.Active ? 1 : 0);
    $("#ErrorPhoneUpdate").hide();
}

function UpdatePhone() {
    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    var phoneObj = {
        "Id": $("#IdPhoneUpdate").val(),
        "Customer":customerObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    console.log(phoneObj);

    jQuery.ajax({
        url: '/Customer/UpdateCustomerPhone',
        type: "POST",
        data: JSON.stringify({ customerPhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                phoneTable.ajax.reload();
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneUpdate").modal("hide");
                $("#FormModalPhone").modal("show");
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneUpdate").modal("hide");
                swal({
                    title: "No se Logró Actualizar el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalPhoneUpdate").modal("show");
                });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function DeletePhone(){
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }
    phoneObj = phoneTable.row(rowSelected).data();

    $("#FormModalPhone").modal("hide");

    swal({
        title: "Eliminar Teléfono",
        text: "¿Estas Seguro que Deseas Eliminar este teléfono?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function (inputValue) {

            if (!inputValue) {
                $("#FormModalPhone").modal("show");
                return
            }

            jQuery.ajax({
                url: '/Customer/DeleteCustomerPhone',
                type: "POST",
                data: JSON.stringify({ customerPhone: phoneObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        phoneTable.ajax.reload();
                        $("#FormModalPhone").modal("show");
                    }
                    else {
                        swal("No Logró Eliminar el teléfono.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

function ShowEmailRead() {

    $("#FormModalEmail").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    customerObj = customerTable.row(rowSelected).data();

    if (emailTable != null) {
        emailTable.destroy();
    }

    emailTable = $('#dataTableEmail').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Customer/ReadCustomerEmailsByCustomerId',
            type: "POST",
            data: { customerId: customerObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "Email" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ValidatorEmail() {

    $("#CreateEmailForm").validate({
        rules: {
            EmailCreate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailCreate: { required: "- El campo \"Correo\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateEmailForm").validate({
        rules: {
            EmailUpdate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailUpdate: { required: "- El campo \"Correo\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowEmailCreate() {
    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailCreate").modal("show");

    $("#EmailCreate").val("");
    $("#ActiveEmailCreate").val(1);
    $("#ErrorEmailCreate").hide();
}

function CreateEmail() {

    if (!$("#CreateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Customer":customerObj,
        "Email": $("#EmailCreate").val(),
        "Active": $("#ActiveEmailCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Customer/CreateCustomerEmail',
        type: "POST",
        data: JSON.stringify({ customerEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                emailTable.ajax.reload();
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailCreate").modal("hide");
                $("#FormModalEmail").modal("show");
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el correo.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalEmailCreate").modal("show");
                });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowEmailUpdate() {
    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#IdEmailUpdate").val(emailObj.Id);
    $("#EmailUpdate").val(emailObj.Email);
    $("#ActiveEmailUpdate").val(emailObj.Active ? 1 : 0);
    $("#ErrorEmailUpdate").hide();
}

function UpdateEmail() {
    if (!$("#UpdateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Id": $("#IdEmailUpdate").val(),
        "Customer":customerObj,
        "Email": $("#EmailUpdate").val(),
        "Active": $("#ActiveEmailUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/Customer/UpdateCustomerEmail',
        type: "POST",
        data: JSON.stringify({ customerEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.result) {
                emailTable.ajax.reload();
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailUpdate").modal("hide");
                $("#FormModalEmail").modal("show");
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailUpdate").modal("hide");
                swal({
                    title: "No se Logró Actualizar el Correo.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $("#FormModalEmailUpdate").modal("show");
                });
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function DeleteEmail() {

    rowSelected = $(this).closest("tr");

    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }
    
    emailObj = emailTable.row(rowSelected).data();

    $("#FormModalEmail").modal("hide");

    swal({
        title: "Eliminar Teléfono",
        text: "¿Estas Seguro que Deseas Eliminar este correo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function (inputValue) {

            if (!inputValue) {
                $("#FormModalEmail").modal("show");
                return
            }

            jQuery.ajax({
                url: '/Customer/DeleteCustomerEmail',
                type: "POST",
                data: JSON.stringify({ customerEmail: emailObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    }
                    else {
                        swal("No Logró Eliminar el correo.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});