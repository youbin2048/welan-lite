#pragma once

#include "esphome/components/web_server_base/web_server_base.h"
#include "esphome/core/component.h"

namespace esphome {
namespace web_assets {

class StaticAssetHandler : public AsyncWebHandler {
 public:
  bool canHandle(AsyncWebServerRequest *request) const override;
  void handleRequest(AsyncWebServerRequest *request) override;
  bool isRequestHandlerTrivial() const override { return false; }

 protected:
  void send_asset_(AsyncWebServerRequest *request, const char *content_type, const uint8_t *data, size_t size) const;
};

class WebAssets : public Component {
 public:
  void setup() override;
  float get_setup_priority() const override;

 protected:
  StaticAssetHandler handler_;
};

}  // namespace web_assets
}  // namespace esphome
