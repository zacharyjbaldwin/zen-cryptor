var jQuery = require('jquery');

jQuery(document).ready(function($) {
    const crypto = require('crypto');
    const dialog = require('electron').remote.dialog;
    // $('#titlebar').click(function() {
    //     $(this).fadeTo('fast', function() {
    //         $(this).addClass('is-hidden');
    //     });
    // });

    //#################
    // DEBUG OPTIONS
    var forceShowTabs = false;
    var useDefaultAlgorithmAndPassword = false;
    //#################

    function Settings() {
        this.encryptionAlgorithm = undefined;
        this.encryptionPassword = undefined;
        this.pages = [$('#introductionAndSetupPage'), $('#textEncryptionPage'), $('#textDecryptionPage'), $('#fileEncryptionPage'), $('#fileDecryptionPage')];
        this.tabs = [$('#introductionAndSetupTab'), $('#textEncryptionTab'), $('#textDecryptionTab'), $('#fileEncryptionTab'), $('#fileDecryptionTab')];

        this.getEncryptionAlgorithm = function() { return this.encryptionAlgorithm; };
        this.getEncryptionPassword = function() { return this.encryptionPassword; };
        this.setEncryptionAlgorithm = function(algorithm) { this.encryptionAlgorithm = algorithm; };
        this.setEncryptionPassword = function(password) { this.encryptionPassword = password; };
        this.getPages = function() { return this.pages; };
        this.getTabs = function() { return this.tabs; };
    }
    var settings = new Settings();

    if (forceShowTabs) {
        settings.getTabs().forEach(function(item) {
            $(item).removeClass('is-hidden');
        });
    }

    if (useDefaultAlgorithmAndPassword) {
        settings.setEncryptionAlgorithm('blowfish');
        settings.setEncryptionPassword('testpass123');
        $('#openSetupModalButton').addClass('is-disabled');
        $('#openSetupModalButton').text('Using default algorithm and password!');
    }

    crypto.getCiphers().forEach(function(item) {
        var algorithm = document.createElement('option');
        algorithm.text = item;
        algorithm.value = item;
        $('#setupModalEncryptionAlgorithmSelector').append(algorithm);
    });

    function focusTabAndPage(tab, page) {
        settings.getPages().forEach(function(item) {
            $(item).addClass('is-hidden');
        });
        settings.getTabs().forEach(function(item) {
            $(item).removeClass('is-active');
        });

        $(tab).addClass('is-active');
        $(page).removeClass('is-hidden');
    }

    function showErrorModal(errorMessage) {
        $('#errorMessageModal').ready(function() {
            $('.error-message').text(errorMessage);
            $('#errorMessageModal').addClass('is-active');
            $('.modal-background').click(function() {
                $('#errorMessageModal').removeClass('is-active');
            });
            $('.close-modal').click(function() {
                $('#errorMessageModal').removeClass('is-active');
            });
        });
    }

    $('#fileDecryptionTab').click(function() {
        focusTabAndPage($(this), $('#fileDecryptionPage'));
    });

    $('#fileEncryptionTab').click(function() {
        focusTabAndPage($(this), $('#fileEncryptionPage'));

        var addFilesButton = $('.add-files');
        var encryptFilesButton = $('.do-action');
        var queTable = $('.que-table');
        var filesToEncrypt = [];

        var tableApp = new function() {
            this.queTable = $('.que-table');
            this.fileNames = [];

            this.fetch = function() {
                var data = undefined;
                if (fileNames.length > 0) {
                    for (var i = 0; i < this.filesNames.length; i++) {
                        data += '<tr>';
                        data += '<td>' + this.fileNames[i] + '</td>';
                        data += '<td><button class="delete" onclick="tableApp.delete(' + i + ')"></button></td>';
                        data += '</tr>';
                    }
                }
                return queTable.html(data);
            };

            this.delete = function(index) {
                this.filesNames.splice(item, 1)
                fetch();
            };
        }

        // addFilesButton.click(function() {
        //     dialog.showOpenDialog({
        //         defaultPath: __dirname,
        //         filters: [{ extensions: [] }],
        //         properties: ['multiSelections', 'openFile']
        //     }, function() {

        //     });
        // });

        addFilesButton.click(function() {
            var showZCWarning = false;
            var workingFiles = [];

            dialog.showOpenDialog({
                defaultPath: __dirname,
                properties: ['multiSelections', 'openFile']
            }, function(files) {
                if (files != '') {
                    files.forEach(function(item) {
                        if (item != undefined && !(item.endsWith('.zc'))) {
                            tableApp.delete(1);
                        } else if (item != undefined && (item.endsWith('.zc'))) {
                            showZCWarning = true;
                        }
                    });
                }
            });
        });

        var que = new function() {
            this.add = function() {};
            this.delete = function(index) {};
        };
    });

    $('#introductionAndSetupTab').click(function() {
        focusTabAndPage($(this), $('#introductionAndSetupPage'));
    }).ready(function() {
        $('#openSetupModalButton').click(function() {
            $('#setupModal').addClass('is-active');

            $('#setupModalApplySettingsButton').click(function() {
                settings.setEncryptionAlgorithm($('#setupModalEncryptionAlgorithmSelector').val());
                settings.setEncryptionPassword($('#setupModalPasswordTextBox').val());

                // console.log(settings.getEncryptionAlgorithm());
                // console.log(settings.getEncryptionPassword());
                $('#setupModal').removeClass('is-active');
                $('#openSetupModalButton').addClass('is-disabled').text('Settings have been applied!');

                settings.getTabs().forEach(function(item) {
                    $(item).removeClass('is-hidden');
                });
            });

            $('.close-modal').click(function() {
                $('#setupModal').removeClass('is-active');
            });

            $('#setupModalConfirmPasswordTextBox').keyup(function() {
                testIfPasswordsMatchAndActivateModalComponents();
            });

            $('#setupModalPasswordTextBox').keyup(function() {
                if ($(this).val() != '') {
                    $('#setupModalConfirmPasswordTextBox').removeClass('is-disabled');
                } else if ($(this).val() == '') {
                    $('#setupModalConfirmPasswordTextBox').addClass('is-disabled');
                }

                testIfPasswordsMatchAndActivateModalComponents();
            });

            $('.modal-background').click(function() {
                $('#setupModal').removeClass('is-active');
            });

            function testIfPasswordsMatchAndActivateModalComponents() {
                var passwordTextBoxValue = $('#setupModalPasswordTextBox').val();
                var confirmPasswordTextBoxValue = $('#setupModalConfirmPasswordTextBox').val();
                var checkBoxes = [$('#setupModalPasswordTextBoxCheckBox'), $('#setupModalConfirmPasswordTextBoxCheckBox')];
                if ((passwordTextBoxValue == confirmPasswordTextBoxValue) && ((passwordTextBoxValue != '') && (confirmPasswordTextBoxValue != ''))) {
                    $('#setupModalApplySettingsButton').removeClass('is-disabled');
                    $('#setupModalErrorMessage').addClass('is-hidden')
                    checkBoxes.forEach(function(item) {
                        $(item).removeClass('is-hidden');
                    });
                } else {
                    $('#setupModalApplySettingsButton').addClass('is-disabled');
                    if ((passwordTextBoxValue != '') && (confirmPasswordTextBoxValue != '')) {
                        $('#setupModalErrorMessage').addClass('is-hidden');
                    } else {
                        $('#setupModalErrorMessage').removeClass('is-hidden');
                    }
                    checkBoxes.forEach(function(item) {
                        $(item).addClass('is-hidden');
                    });
                }
            }
        });

        $('#openLicenseModal').click(function() {
            $('#licenseModal').addClass('is-active');

            $('.close-modal').click(function() {
                $('#licenseModal').removeClass('is-active');
            });

            $('.modal-background').click(function() {
                $('#licenseModal').removeClass('is-active');
            });
        });
    });

    $('#title').click(function() {
        alert('Hello from my creator!', 'Zen-Cryptor by Zachary J. Baldwin');
    });

    $('#textDecryptionTab').click(function() {
        focusTabAndPage($(this), $('#textDecryptionPage'));

        $('#decryptTextButton').click(function() {
            try {
                var cipher = crypto.createDecipher(settings.getEncryptionAlgorithm(), settings.getEncryptionPassword());
                var decryptedText = cipher.update($('#textToBeDecrypted').val(), 'hex', 'utf8');
                decryptedText += cipher.final('utf8');
                $('#decryptedText').html('<textarea class="textarea is-fullwidth">' + decryptedText + '</textarea>')
                $('#decryptedTextModal').addClass('is-active');

                $('.modal-background').click(function() {
                    $('#decryptedTextModal').removeClass('is-active');
                });

                $('#decryptedTextModalDoneButton').click(function() {
                    $('#decryptedTextModal').removeClass('is-active');
                });
            } catch (error) {
                showErrorModal('Text is not decrypt-able!');
            }
        });
        $('#textToBeDecrypted').keyup(function() {
            if ($(this).val() != '') {
                $('#decryptTextButton').removeClass('is-disabled');
            } else if ($(this).val() == '') {
                $('#decryptTextButton').addClass('is-disabled');
            }
        });
    });

    $('#textEncryptionTab').click(function() {
        focusTabAndPage($(this), $('#textEncryptionPage'));

        $('#encryptTextButton').click(function() {
            var cipher = crypto.createCipher(settings.getEncryptionAlgorithm(), settings.getEncryptionPassword());
            var encryptedText = cipher.update($('#textToBeEncrypted').val(), 'utf8', 'hex');
            encryptedText += cipher.final('hex');
            // alert(encryptedText);
            // $('#encryptedText').text(encryptedText);
            $('#encryptedText').html('<textarea class="textarea is-fullwidth">' + encryptedText + '</textarea>')
            $('#encryptedTextModal').addClass('is-active');

            $('.modal-background').click(function() {
                $('#encryptedText').text('');
                $('#encryptedTextModal').removeClass('is-active');
            });

            $('#encryptedTextModalDoneButton').click(function() {
                // $('#encryptedText').text('');
                $('#encryptedTextModal').removeClass('is-active');
            });
        });
        $('#textToBeEncrypted').keyup(function() {
            if ($(this).val() != '') {
                $('#encryptTextButton').removeClass('is-disabled');
            } else if ($(this).val() == '') {
                $('#encryptTextButton').addClass('is-disabled');
            }
        });
    });
});