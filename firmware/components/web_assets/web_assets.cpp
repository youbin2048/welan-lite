#include "web_assets.h"

#include "esphome/components/web_server_base/web_server_base.h"
#include "esphome/core/log.h"

namespace esphome {
namespace web_assets {

static const char *const TAG = "web_assets";

extern const uint8_t WELAN_INDEX_HTML_GZ[];
extern const size_t WELAN_INDEX_HTML_GZ_SIZE;
extern const uint8_t WELAN_APP_CSS_GZ[];
extern const size_t WELAN_APP_CSS_GZ_SIZE;
extern const uint8_t WELAN_APP_JS_GZ[];
extern const size_t WELAN_APP_JS_GZ_SIZE;

bool StaticAssetHandler::canHandle(AsyncWebServerRequest *request) const {
  if (request->method() != HTTP_GET) {
    return false;
  }

  const std::string url = request->url();
  return url == "/" || url == "/app.css" || url == "/app.js" || url == "/favicon.ico";
}

void StaticAssetHandler::handleRequest(AsyncWebServerRequest *request) {
  const std::string url = request->url();

  if (url == "/") {
    this->send_asset_(request, "text/html; charset=utf-8", WELAN_INDEX_HTML_GZ, WELAN_INDEX_HTML_GZ_SIZE);
    return;
  }

  if (url == "/app.css") {
    this->send_asset_(request, "text/css; charset=utf-8", WELAN_APP_CSS_GZ, WELAN_APP_CSS_GZ_SIZE);
    return;
  }

  if (url == "/app.js") {
    this->send_asset_(request, "application/javascript; charset=utf-8", WELAN_APP_JS_GZ, WELAN_APP_JS_GZ_SIZE);
    return;
  }

  if (url == "/favicon.ico") {
    request->send(204);
    return;
  }

  request->send(404, "text/plain", "Not Found");
}

void StaticAssetHandler::send_asset_(AsyncWebServerRequest *request, const char *content_type, const uint8_t *data,
                                     size_t size) const {
  auto *response = request->beginResponse(200, content_type, data, size);
  response->addHeader("Content-Encoding", "gzip");
  response->addHeader("Cache-Control", "no-store");
  response->addHeader("X-Content-Type-Options", "nosniff");
  request->send(response);
}

void WebAssets::setup() {
  if (web_server_base::global_web_server_base == nullptr) {
    ESP_LOGE(TAG, "web_server_base is not available");
    return;
  }

  web_server_base::global_web_server_base->add_handler(&this->handler_);
  ESP_LOGI(TAG, "Registered custom UI routes: /, /app.css, /app.js");
}

float WebAssets::get_setup_priority() const { return setup_priority::WIFI; }

}  // namespace web_assets
}  // namespace esphome
