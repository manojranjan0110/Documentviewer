$(document).ready(function () {
    var pdfModal = new bootstrap.Modal($('#pdfModal')[0]);
    var $pdfFrame = $('#pdfFrame');
/*    $('#loader').hide();*/

    $(document).on('click', '.btn-view', function () {
        var fileName = $(this).data('filename');
        var pdfPath = '/Documents/' + encodeURIComponent(fileName);
        $pdfFrame.attr('src', pdfPath);
        pdfModal.show();
    });

    $('#pdfModal').on('hidden.bs.modal', function () {
        $pdfFrame.attr('src', '');
    });

    function loadDocuments(data) {
        const tbody = $("#documentTable tbody");
        tbody.empty();

        if (data.length === 0) {
            $("#noResults").show();
            $("#documentTable").hide();
            return;
        }

        $("#noResults").hide();
        $("#documentTable").show();

        $.each(data, function (i, doc) {
            const row = `<tr>
                        <td>${doc.fileName}</td>
                        <td>${new Date(doc.uploadedOn).toLocaleDateString()}</td>
                          <td>
                            <button class="btn btn-link btn-view" data-filename="${doc.fileName}">View</button>
                        </td>
                    </tr>`;
            tbody.append(row);
        });
    }

    $("#searchBtn").on("click", function () {

        const keyword = $("#keyword").val().trim();

        if (keyword !== "") {

            $('#pageLoader').show();
            $('body').css('pointer-events', 'none');

        }
        $.ajax({
            url: `/Document/Search?keyword=${encodeURIComponent(keyword)}`,
            type: "GET",
            dataType: "json",

            success: function (data) {
                loadDocuments(data);
            },

            error: function (xhr, status, error) {
                console.error("Search failed:", error);
                alert("Something went wrong while searching.");
            },

            complete: function () {
                $('#pageLoader').hide();
                $('body').css('pointer-events', 'auto');
            }
        });
    });


    $("#resetBtn").on("click", function () {
        $("#keyword").val('');
        $.getJSON(`/Document/Search`, function (data) {
            loadDocuments(data);

        });
    });

});