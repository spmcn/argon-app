"use strict";
var web_view_1 = require("ui/web-view");
var Argon = require("@argonjs/argon");
var observable_array_1 = require("data/observable-array");
var ArgonWebView = (function (_super) {
    __extends(ArgonWebView, _super);
    function ArgonWebView() {
        var _this = _super.call(this) || this;
        _this.isArgonApp = false;
        _this._logs = new observable_array_1.ObservableArray();
        return _this;
    }
    Object.defineProperty(ArgonWebView.prototype, "logs", {
        get: function () { return this._logs; },
        enumerable: true,
        configurable: true
    });
    ;
    ArgonWebView.prototype._didCommitNavigation = function () {
        if (this.session)
            this.session.close();
        this.logs.length = 0;
        this.session = undefined;
        this._outputPort = undefined;
    };
    ArgonWebView.prototype._handleArgonMessage = function (message) {
        var _this = this;
        if (this.session && !this.session.isConnected)
            return;
        if (!this.session) {
            var sessionUrl = this.getCurrentUrl();
            console.log('Connecting to argon.js session at ' + sessionUrl);
            var manager = Argon.ArgonSystem.instance;
            var messageChannel = manager.session.createSynchronousMessageChannel();
            var session = manager.session.addManagedSessionPort(sessionUrl);
            var port = messageChannel.port2;
            port.onmessage = function (msg) {
                if (!_this.session)
                    return;
                var injectedMessage = "__ARGON_PORT__.postMessage(" + JSON.stringify(msg.data) + ")";
                _this.evaluateJavascript(injectedMessage);
            };
            var args = {
                eventName: ArgonWebView.sessionEvent,
                object: this,
                session: session
            };
            this.notify(args);
            this.session = session;
            this._outputPort = port;
            session.open(messageChannel.port1, manager.session.configuration);
        }
        // console.log(message);
        this._outputPort && this._outputPort.postMessage(JSON.parse(message));
    };
    ArgonWebView.prototype._handleLogMessage = function (message) {
        if (!message)
            return;
        var log = JSON.parse(message);
        if (!log.message)
            return;
        log.lines = log.message.split(/\r\n|\r|\n/);
        console.log(this.getCurrentUrl() + ' (' + log.type + '): ' + log.lines.join('\n\t > '));
        this.logs.push(log);
        var args = {
            eventName: ArgonWebView.logEvent,
            object: this,
            log: log
        };
        this.notify(args);
    };
    return ArgonWebView;
}(web_view_1.WebView));
ArgonWebView.sessionEvent = 'session';
ArgonWebView.logEvent = 'log';
exports.ArgonWebView = ArgonWebView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJnb24td2ViLXZpZXctY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXJnb24td2ViLXZpZXctY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSx3Q0FBbUM7QUFDbkMsc0NBQXVDO0FBQ3ZDLDBEQUFzRDtBQUd0RDtJQUEyQyxnQ0FBTztJQWdCOUM7UUFBQSxZQUNJLGlCQUFPLFNBQ1Y7UUFiTSxnQkFBVSxHQUFHLEtBQUssQ0FBQztRQUtsQixXQUFLLEdBQUcsSUFBSSxrQ0FBZSxFQUFXLENBQUM7O0lBUS9DLENBQUM7SUFQRCxzQkFBVyw4QkFBSTthQUFmLGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUEsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBUy9CLDJDQUFvQixHQUEzQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sMENBQW1CLEdBQTFCLFVBQTJCLE9BQWM7UUFBekMsaUJBaUNDO1FBL0JHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUV0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUV4QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBQy9ELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUyxDQUFDO1lBQzVDLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsQ0FBQztZQUN6RSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWxFLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUM7WUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLEdBQTBCO2dCQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUMxQixJQUFNLGVBQWUsR0FBRyw2QkFBNkIsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBQyxHQUFHLENBQUM7Z0JBQ25GLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFFRCxJQUFNLElBQUksR0FBd0I7Z0JBQzlCLFNBQVMsRUFBRSxZQUFZLENBQUMsWUFBWTtnQkFDcEMsTUFBTSxFQUFFLElBQUk7Z0JBQ1osT0FBTyxFQUFFLE9BQU87YUFDbkIsQ0FBQTtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFeEIsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDckUsQ0FBQztRQUNELHdCQUF3QjtRQUN4QixJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRU0sd0NBQWlCLEdBQXhCLFVBQXlCLE9BQWM7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDVCxNQUFNLENBQUM7UUFDWCxJQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUNiLE1BQU0sQ0FBQztRQUNYLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBTSxJQUFJLEdBQW9CO1lBQzFCLFNBQVMsRUFBRSxZQUFZLENBQUMsUUFBUTtZQUNoQyxNQUFNLEVBQUMsSUFBSTtZQUNYLEdBQUcsRUFBRSxHQUFHO1NBQ1gsQ0FBQTtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQVFMLG1CQUFDO0FBQUQsQ0FBQyxBQXJGRCxDQUEyQyxrQkFBTztBQUVoQyx5QkFBWSxHQUFHLFNBQVMsQ0FBQztBQUN6QixxQkFBUSxHQUFHLEtBQUssQ0FBQztBQUhiLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZGVmIGZyb20gJ2FyZ29uLXdlYi12aWV3J1xuaW1wb3J0IHtXZWJWaWV3fSBmcm9tICd1aS93ZWItdmlldydcbmltcG9ydCAqIGFzIEFyZ29uIGZyb20gJ0BhcmdvbmpzL2FyZ29uJ1xuaW1wb3J0IHtPYnNlcnZhYmxlQXJyYXl9IGZyb20gJ2RhdGEvb2JzZXJ2YWJsZS1hcnJheSc7XG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFyZ29uV2ViVmlldyBleHRlbmRzIFdlYlZpZXcgaW1wbGVtZW50cyBkZWYuQXJnb25XZWJWaWV3IHtcbiAgICBcbiAgICBwdWJsaWMgc3RhdGljIHNlc3Npb25FdmVudCA9ICdzZXNzaW9uJztcbiAgICBwdWJsaWMgc3RhdGljIGxvZ0V2ZW50ID0gJ2xvZyc7XG5cbiAgICBwdWJsaWMgaXNBcmdvbkFwcCA9IGZhbHNlO1xuXG4gICAgcHVibGljIHRpdGxlIDogc3RyaW5nO1xuICAgIHB1YmxpYyBwcm9ncmVzcyA6IG51bWJlcjtcblxuICAgIHByaXZhdGUgX2xvZ3MgPSBuZXcgT2JzZXJ2YWJsZUFycmF5PGRlZi5Mb2c+KCk7XG4gICAgcHVibGljIGdldCBsb2dzKCkge3JldHVybiB0aGlzLl9sb2dzfTtcblxuICAgIHB1YmxpYyBzZXNzaW9uPzpBcmdvbi5TZXNzaW9uUG9ydDtcbiAgICBwcml2YXRlIF9vdXRwdXRQb3J0PzpBcmdvbi5NZXNzYWdlUG9ydExpa2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgX2RpZENvbW1pdE5hdmlnYXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnNlc3Npb24pIHRoaXMuc2Vzc2lvbi5jbG9zZSgpO1xuICAgICAgICB0aGlzLmxvZ3MubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9vdXRwdXRQb3J0ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBfaGFuZGxlQXJnb25NZXNzYWdlKG1lc3NhZ2U6c3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuc2Vzc2lvbiAmJiAhdGhpcy5zZXNzaW9uLmlzQ29ubmVjdGVkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCF0aGlzLnNlc3Npb24pIHsgXG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uVXJsID0gdGhpcy5nZXRDdXJyZW50VXJsKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW5nIHRvIGFyZ29uLmpzIHNlc3Npb24gYXQgJyArIHNlc3Npb25VcmwpO1xuICAgICAgICAgICAgY29uc3QgbWFuYWdlciA9IEFyZ29uLkFyZ29uU3lzdGVtLmluc3RhbmNlITtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VDaGFubmVsID0gbWFuYWdlci5zZXNzaW9uLmNyZWF0ZVN5bmNocm9ub3VzTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb24gPSBtYW5hZ2VyLnNlc3Npb24uYWRkTWFuYWdlZFNlc3Npb25Qb3J0KHNlc3Npb25VcmwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBwb3J0ID0gbWVzc2FnZUNoYW5uZWwucG9ydDI7XG4gICAgICAgICAgICBwb3J0Lm9ubWVzc2FnZSA9IChtc2c6QXJnb24uTWVzc2FnZUV2ZW50TGlrZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5zZXNzaW9uKSByZXR1cm47XG4gICAgICAgICAgICAgICAgY29uc3QgaW5qZWN0ZWRNZXNzYWdlID0gXCJfX0FSR09OX1BPUlRfXy5wb3N0TWVzc2FnZShcIitKU09OLnN0cmluZ2lmeShtc2cuZGF0YSkrXCIpXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsdWF0ZUphdmFzY3JpcHQoaW5qZWN0ZWRNZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhcmdzOmRlZi5TZXNzaW9uRXZlbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogQXJnb25XZWJWaWV3LnNlc3Npb25FdmVudCxcbiAgICAgICAgICAgICAgICBvYmplY3Q6IHRoaXMsXG4gICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub3RpZnkoYXJncyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2Vzc2lvbiA9IHNlc3Npb247XG4gICAgICAgICAgICB0aGlzLl9vdXRwdXRQb3J0ID0gcG9ydDtcblxuICAgICAgICAgICAgc2Vzc2lvbi5vcGVuKG1lc3NhZ2VDaGFubmVsLnBvcnQxLCBtYW5hZ2VyLnNlc3Npb24uY29uZmlndXJhdGlvbilcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5fb3V0cHV0UG9ydCAmJiB0aGlzLl9vdXRwdXRQb3J0LnBvc3RNZXNzYWdlKEpTT04ucGFyc2UobWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBfaGFuZGxlTG9nTWVzc2FnZShtZXNzYWdlOnN0cmluZykge1xuICAgICAgICBpZiAoIW1lc3NhZ2UpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IGxvZzpkZWYuTG9nID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcbiAgICAgICAgaWYgKCFsb2cubWVzc2FnZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbG9nLmxpbmVzID0gbG9nLm1lc3NhZ2Uuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZ2V0Q3VycmVudFVybCgpICsgJyAoJyArIGxvZy50eXBlICsgJyk6ICcgKyBsb2cubGluZXMuam9pbignXFxuXFx0ID4gJykpOyBcbiAgICAgICAgdGhpcy5sb2dzLnB1c2gobG9nKTtcbiAgICAgICAgY29uc3QgYXJnczpkZWYuTG9nRXZlbnREYXRhID0ge1xuICAgICAgICAgICAgZXZlbnROYW1lOiBBcmdvbldlYlZpZXcubG9nRXZlbnQsXG4gICAgICAgICAgICBvYmplY3Q6dGhpcyxcbiAgICAgICAgICAgIGxvZzogbG9nXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RpZnkoYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGV2YWx1YXRlSmF2YXNjcmlwdChzY3JpcHQ6c3RyaW5nKSA6IFByb21pc2U8YW55PjtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBicmluZ1RvRnJvbnQoKTtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDdXJyZW50VXJsKCkgOiBzdHJpbmc7XG5cbn1cbiJdfQ==