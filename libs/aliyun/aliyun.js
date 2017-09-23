(function(exports){
    var config = {};
    var filename = '';

    var guid = function() {
        return S4() + S4() + S4() + S4() + S4() + S4();
    };
    var S4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    var sendRequest = function(method, url, data) {
        return new Promise(function(resolve, reject) {
            let request = new XMLHttpRequest();
            request.responseType = 'json';
            request.open(method, url, true);
            request.onreadystatechange = handler;
            request.send(data || null);

            function handler() {
                if (this.readyState !== 4) {
                    return;
                }
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText));
                }
            };
        });
    };

    var getConfig = function() {
        return sendRequest('GET', '/aliyun/signature');
    };

    var getFileUrl = function() {
        return config.domain + "/" + filename;
    }

    var getFileExtension = function(file, fileType) {
        if (fileType == 'image') {
            return file.name.slice(file.name.lastIndexOf('.'));
        }

        if (fileType == 'voice') {
            return '.mp3';
        }

        return '';
    }

    var generateFormDataAndUpload = function(file, params, config, successCallback) {
        let formData = new FormData();
        let fileType = params.fileType;
        let fileExtension = getFileExtension(file, fileType);
        filename = fileType + '/' + guid() + fileExtension;

        formData.append("key", filename);
        formData.append("policy", config.policy);
        formData.append("OSSAccessKeyId", config.accessKeyId);
        formData.append("signature", config.signature);
        formData.append("success_action_status", 200);
        formData.append("file", file);

        if (fileType == 'voice') {
            formData.append("x:duration", params.duration || 0);
            formData.append("x:from", params.from || 'reply');
        }

        sendRequest('POST', config.uploadDomain, formData).then(function() {
            successCallback(getFileUrl());
        });
    };

    var Aliyun = {
        upload: function(file, params, successCallback, failedCallback) {
            getConfig().then(function(data) {
                config = data;
                generateFormDataAndUpload(file, params, config, successCallback);
            }).catch(function(error){
                failedCallback();
            });
        }
    }

    //模块接口
    exports.Aliyun = Aliyun;
})(window);