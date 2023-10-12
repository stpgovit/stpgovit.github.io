var main_template = `<div class="broadband_challenge" style="position: relative;">
<form id="bc-challenge-form">
    <div class="container">
        <div class="row">
            <div class="col">
                <h2>Broadband Availability Challenge</h2>
                <div class="form-errors">All fields are required unless the marked as optional.</div>
                <p>To dispute the information on services provided at your address enter information about yourself and your dispute. All fields are required unless marked optional.</p>
                <div id="bc-results" class="results hidden">Success</div>
                <h4>Your Contact Information</h4>
                <hr />
                <input type="hidden" id="returnURL" name="returnURL" value="http://www.google.com" />
                <input type="hidden" id="client" name="client" value="0" />
            </div>
        </div>
        <div class="row">
            <div class="col ">
                <label>Name</label>
                <input type="text" id="name" name="name" required />
                <span class="text_warning text_small text_required">This field is required!</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Email</label>
                <input type="text" id="email" name="email" required />
                <span class="text_warning text_small text_required">This field is required!</span>
            </div>
            <div class="col">
                <label>Phone Number (optional)</label>
                <input type="text" id="phone" name="phone" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Address Line 1</label>
                <input type="text" id="address" name="address" required />
                <span class="text_warning text_small text_required">This field is required!</span>
            </div>
            <div class="col">
                <label>Address Line 2 (optional)</label>
                <input type="text" id="address2" name="address2" />
            </div>
            <div class="col">
                <label>Zip Code</label>
                <input type="text" id="zipcode" name="zipcode" required />
                <span class="text_warning text_small text_required">This field is required!</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Service Provider</label>
                <input type="text" id="provider" name="provider" required />
                <span class="text_warning text_small text_required">This field is required!</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <h4 class="top-margin">Tell Us More About Your Challenge</h4>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Describe Your Experience</label>
                <textarea rows="25" cols="auto" required id="body" name="body"></textarea>
                <span class="text_warning text_small text_required">This field is required!</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>Evidence For Your Challenge</label>
                <p>Click the "Browse" button to select a file (DOC, DOCX, PDF, JPEG, PNG)<br />File names may only contain the following characters: a-z A-Z 0-9 !-_.()<br />Examples of evidence include correspondence with the provider or a screenshot of a speedtest result showing upload speed, download speed, and latency such as <a href="https://speed.cloudflare.com/" target="_blank">https://speed.cloudflare.com/</a></p>
                <table class="file-holder" id="bc-file-holder">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Size</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4"><em>Selected file will appear here.</em></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4"><button type="button" id="bc-file-browser">Browse</button></td>
                        </tr>
                    </tfoot>
                </table>
                <input type="file" id="evidence" name="evidence" class="hidden" accept=".doc,.docx,.pdf,.jpg,.jpeg,.png" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button type="button" id="bc-button-submit">Submit</button>
                <button type="reset" class="outline">Clear</button>
            </div>
        </div>
    </div>
</form>
</div>`;

document.addEventListener('DOMContentLoaded', function () {
    var main_element = document.querySelector('[data-role="broadband-challenge"]');
    main_element.innerHTML = main_template;

    var clientid = document.getElementById("client");
    clientid.value = main_element.dataset.clientid;

    var fileInput = document.getElementById("evidence");
    var fileBrowse = document.getElementById("bc-file-browser");
    var fileTable = document.getElementById("bc-file-holder");
    var submitButton = document.getElementById("bc-button-submit");
    var formElement = document.getElementById("bc-challenge-form");
    var resultsElement = document.getElementById("bc-results");
    var overlay = document.getElementById("bc-overlay");
    var timeout;
    var valid_file_type= ['application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf','image/png','image/jpeg'];

    fileBrowse.onclick = function(e) {
        fileInput.click();
    }

    fileInput.addEventListener("change", function(e) {
        var status;
        var blob = fileInput.files[0];

        var regexPattern = /[^a-zA-Z0-9()!._-\s]/;
        var hasMatch = regexPattern.test(fileInput.files[0].name);

        if(valid_file_type.includes(blob.type) && hasMatch === false) {
            status = '<span class="text_success">Valid File</span>';
            fileTable.dataset.filevalid = true;
        } else {
            status = '<span class="text_warning">Invalid File</span>';
            fileTable.dataset.filevalid = false;
        }

        fileTable.querySelector("tbody").innerHTML = `<tr>
                        <td>${fileInput.files[0].name}</td>
                        <td>${Math.ceil(fileInput.files[0].size/1000)} KB</td>
                        <td>${status}</td>
                        <td style="text-align: right;padding-right:6px;"><button type="button" class="delete" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="delete" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                            </svg></button>
                        </td>
                    </tr>`;

        fileTable.querySelector(".delete").addEventListener("click", function(){
            fileInput.value = null;
            fileTable.querySelector("tbody").innerHTML = `<tr>
                        <td colspan="4"><em>Selected file will appear here.</em></td>
                    </tr>`;
            fileTable.dataset.filevalid = null;   
        });            
    });

    submitButton.onclick = function(e) {
        var isValid = true;

        var fields = document.querySelectorAll("[required]");
        
        fields.forEach((field) => {
            if(!field.value) {
                isValid = false;
                field.classList.add("invalid");
                field.parentElement.classList.add("invalid");
            } else {
                field.classList.remove("invalid");
                field.parentElement.classList.remove("invalid");
            }
        });

        if(fileTable.dataset.filevalid == "false") {
            isValid = false;
            fileTable.classList.add("invalid");
            console.log("invliad");
        } else {
            fileTable.classList.remove("invalid");
            console.log("valid")
        }

        if(isValid == true) {
            toggleButtonSpinner(e.target);
            var formData = new FormData(document.getElementById("bc-challenge-form"));

            fetch('https://www3.stpgov.org/apps/BroadbandChallenge/Challenge/Index', {
                method: 'post',
                body: formData,
                //mode: 'no-cors'
            }).then((response) => {
                console.log(response);
                if(!response.ok) {
                    toggleButtonSpinner(e.target);
                    resultsElement.innerHTML = "There was an error submitting your challenge. Please try again later."
                    resultsElement.classList.add("fail");
                    resultsElement.classList.remove("hidden");
                    timeout = setTimeout(function(){
                        resultsElement.classList.add("hidden");
                        resultsElement.classList.remove("success");
                        resultsElement.classList.remove("fail");
                        clearTimeout(timeout);
                    }, 5000);
                } else {
                    toggleButtonSpinner(e.target);
                    resultsElement.innerHTML = "Your challenge has been successfully submitted. Thank you for participating."
                    resultsElement.classList.add("success");
                    resultsElement.classList.remove("hidden");
                    formElement.reset();
                    timeout = setTimeout(function(){
                        resultsElement.classList.add("hidden");
                        resultsElement.classList.remove("success");
                        resultsElement.classList.remove("fail");
                        clearTimeout(timeout);
                    }, 5000);
                }
            }).catch((error)=>{
                toggleButtonSpinner(e.target);
                resultsElement.innerHTML = "There was an error submitting your challenge. Please try again later."
                resultsElement.classList.add("fail");
                resultsElement.classList.remove("hidden");
                timeout = setTimeout(function(){
                    resultsElement.classList.add("hidden");
                    resultsElement.classList.remove("success");
                    resultsElement.classList.remove("fail");
                    clearTimeout(timeout);
                }, 5000);
                console.error('There was a problem with the Fetch operation:', error);
            });
        }
    };

    formElement.addEventListener("reset", function() {
        fileInput.value = null;
            fileTable.querySelector("tbody").innerHTML = `<tr>
                        <td colspan="4"><em>Selected file will appear here.</em></td>
                    </tr>`;
    });
});

function toggleButtonSpinner(element) {
    var el = element.querySelector(".bc-spinner");

    if(el) {
        element.disabled = false;
        el.remove();
    } else {
        element.disabled = true;
        element.innerHTML = '<div class="bc-spinner bc-spinner-small text-color-light"></div>' + element.innerHTML;
    }
}