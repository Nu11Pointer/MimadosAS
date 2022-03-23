var branchOfficeTableRowSelected;
var branchOfficeTable;
var branchOfficeObj;
var branchOfficePhoneObj;
var branchOfficePhoneTable

function SetUp() {

    $('#CollapseMenuBranchOffice').addClass('active');
    $('#collapseOne').addClass('show');
    $('#CollapseMenuItemBranchOffice').addClass('active');

    // Show DataTable
    Read();
    DeparmentReadyCreate();
    ValidatorCreate();
    DeparmentReadyUpdate();
    ValidatorUpdate();
    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "El formato correcto es ####-####");
    ValidatorPhoneCreate();
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
    $("#dataTable tbody").on("click", '.btn-phone', ShowPhoneRead);
    $("#dataTablePhone tbody").on("click", '.btn-update', ShowPhoneUpdate);
    $("#dataTablePhone tbody").on("click", '.btn-detelete', DeletePhone);
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#PhoneCreate").val("");
    $("#Active").val(1);
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#MunicipalityCreate").val($("#MunicipalityCreate option:first").val());
    $("#AddressCreate").val("");
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function DeparmentReadyCreate() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/DeparmentRead',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentCreate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(ChangeMunicipalityCreate);
}

function ChangeMunicipalityCreate() {

    $("#MunicipalityCreate option").remove();

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
}

function ValidatorCreate() {
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            },
            AddressCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio.",
            AddressCreate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowUpdateModal() {

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficeObj = branchOfficeTable.row(rowSelected).data();

    $("#NameUpdate").val(branchOfficeObj.Name);
    $("#ActiveUpdate").val(branchOfficeObj.Active ? 1 : 0);
    $("#DepartmentUpdate").val(branchOfficeObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#AddressUpdate").val(branchOfficeObj.Address);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
}

function DeparmentReadyUpdate() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/DeparmentRead',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(ChangeMunicipalityUpdate);
}

function ChangeMunicipalityUpdate() {

    $("#MunicipalityUpdate option").remove();

    // Load Selector Municipality
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentUpdate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityUpdate");
            })
            try {
                if (branchOfficeObj.Municipality.Id != -1) {
                    $("#MunicipalityUpdate").val(branchOfficeObj.Municipality.Id);
                    branchOfficeObj.Municipality.Id = -1;
                }
            } catch (e) {

            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ValidatorUpdate() {
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
            AddressUpdate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function ShowPhoneRead() {
    $("#FormModalPhone").modal("show");

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficeObj = branchOfficeTable.row(rowSelected).data();

    if (branchOfficePhoneTable != null) {
        branchOfficePhoneTable.destroy();
    }

    branchOfficePhoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/BranchOffice/ReadBranchOfficePhoneByBranchOfficeId',
            type: "POST",
            data: { branchOfficeId: branchOfficeObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "BranchOffice.Name" },
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

function ValidatorPhoneCreate() {

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
}

function ShowPhoneUpdate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneUpdate").modal("show");
    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficePhoneObj = branchOfficePhoneTable.row(rowSelected).data();

    $("#IdPhoneUpdate").val(branchOfficePhoneObj.Id);
    $("#PhoneUpdate").val(branchOfficePhoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(branchOfficePhoneObj.Active ? 1 : 0);
    $("#ErrorPhoneUpdate").hide();
}

function ValidatorPhoneUpdate() {

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

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    branchOfficeObj = {
        Id: 0,
        Name: $("#NameCreate").val(),    
        Address: $("#AddressCreate").val(),
        Municipality: {
            Id: $("#MunicipalityCreate option:selected").val()
        },
        Active: $("#ActiveCreate option:selected").val() == 1 ? true : false,
    };

    jQuery.ajax({
        url: '/BranchOffice/CreateBranchOffice',
        type: "POST",
        data: JSON.stringify({ branchOffice: branchOfficeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            branchOfficeTable.ajax.reload();
            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalCreate").modal("hide");
                branchOfficeTable.ajax.reload();
            }
            else {
                swal("No Logró Actualizar la Sucursal.", response.message, "error");
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

function Read() {
    branchOfficeTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/BranchOffice/ReadBranchOffices',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            { "data": "Municipality.Department.Name"},
            { "data": "Municipality.Name" }, 
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
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm btn-phone mr-1 mb-1"><i class="fas fa-phone-alt"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    branchOfficeObj = {
        Id: branchOfficeObj.Id,
        Name: $("#NameUpdate").val(),
        Address: $("#AddressUpdate").val(),
        Municipality: {
            Id: $("#MunicipalityUpdate option:selected").val()
        },
        Active: $("#ActiveUpdate option:selected").val() == 1 ? true : false,
    };

    jQuery.ajax({
        url: '/BranchOffice/UpdateBranchOffice',
        type: "POST",
        data: JSON.stringify({ branchOffice: branchOfficeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalUpdate").modal("hide");
                branchOfficeTable.ajax.reload();
            }
            else {
                swal("No Logró Actualizar la Sucursal.", response.message, "error");
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
    branchOfficeTableRowSelected = $(this).closest("tr");
    if ($(branchOfficeTableRowSelected).hasClass('child')) {
        branchOfficeTableRowSelected = $(branchOfficeTableRowSelected).prev();
    }
    branchOfficeObj = branchOfficeTable.row(branchOfficeTableRowSelected).data();
    swal({
        title: "Eliminar Sucursal",
        text: "¿Estas Seguro que Deseas Eliminar esta Sucursal?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/BranchOffice/DeleteBranchOffice',
                type: "POST",
                data: JSON.stringify({ branchOffice: branchOfficeObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        branchOfficeTable.ajax.reload();
                    }
                    else {
                        swal("No Logró Eliminar la Sucursal.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

function CreatePhone() {
    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    var branchOfficePhoneObj = {
        "BranchOffice":branchOfficeObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/BranchOffice/CreateBranchOfficePhone',
        type: "POST",
        data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            branchOfficeTable.ajax.reload();
            if (response.result) {
                branchOfficePhoneTable.ajax.reload();
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

function UpdatePhone() {
    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    var branchOfficePhoneObj = {
        "Id": $("#IdPhoneUpdate").val(),
        "BranchOffice":branchOfficeObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    console.log("Aqui va", branchOfficePhoneObj);

    jQuery.ajax({
        url: '/BranchOffice/UpdateBranchOfficePhone',
        type: "POST",
        data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            branchOfficeTable.ajax.reload();
            if (response.result) {
                branchOfficePhoneTable.ajax.reload();
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

function DeletePhone() {
    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }
    branchOfficePhoneObj = branchOfficePhoneTable.row(rowSelected).data();
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
                url: '/BranchOffice/DeleteBranchOfficePhone',
                type: "POST",
                data: JSON.stringify({ branchOfficePhone: branchOfficePhoneObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        branchOfficePhoneTable.ajax.reload();
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

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});