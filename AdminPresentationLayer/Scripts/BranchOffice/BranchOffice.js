var rowSelected;
var BranchOfficeTable;
var branchOfficeObj;

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
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
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
            PhoneCreate: {
                required: true
            },
            AddressCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio.",
            PhoneCreate: "- El campo \"Teléfono\" es obligatorio.",
            AddressCreate: "- El campo \"Dirección\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
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

function ShowUpdateModal() {

    var rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    branchOfficeObj = BranchOfficeTable.row(rowSelected).data();

    $("#NameUpdate").val(branchOfficeObj.Name);
    $("#ActiveUpdate").val(branchOfficeObj.Active ? 1 : 0);
    $("#DepartmentUpdate").val($("#DepartmentUpdate option:first").val());
    $("#MunicipalityUpdate").val($("#MunicipalityUpdate option:first").val());
    $("#AddressUpdate").val(branchOfficeObj.Address);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
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
        url: '/BranchOffice/BranchOfficeCreate',
        type: "POST",
        data: JSON.stringify({ branchOffice: branchOfficeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");
            BranchOfficeTable.ajax.reload();
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
    BranchOfficeTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: false,
        "ajax": {
            url: '/BranchOffice/BranchOfficeRead',
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
        url: '/BranchOffice/BranchOfficeUpdate',
        type: "POST",
        data: JSON.stringify({ branchOffice: branchOfficeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            BranchOfficeTable.ajax.reload();
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
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }
    branchOfficeObj = BranchOfficeTable.row(rowSelected).data();
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
                url: '/BranchOffice/BranchOfficeDelete',
                type: "POST",
                data: JSON.stringify({ branchOffice: branchOfficeObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        BranchOfficeTable.ajax.reload();
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

document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});