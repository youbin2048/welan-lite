import esphome.codegen as cg
import esphome.config_validation as cv
from esphome.const import CONF_ID
from esphome.core import CORE, coroutine_with_priority
from esphome.coroutine import CoroPriority

CODEOWNERS = []
DEPENDENCIES = ["web_server"]

CONF_INDEX_HTML = "index_html"
CONF_APP_CSS = "app_css"
CONF_APP_JS = "app_js"

web_assets_ns = cg.esphome_ns.namespace("web_assets")
WebAssets = web_assets_ns.class_("WebAssets", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(WebAssets),
        cv.Required(CONF_INDEX_HTML): cv.file_,
        cv.Required(CONF_APP_CSS): cv.file_,
        cv.Required(CONF_APP_JS): cv.file_,
    }
).extend(cv.COMPONENT_SCHEMA)


def add_binary_resource(name: str, path: str) -> None:
    full_path = CORE.relative_config_path(path)
    with open(full_path, "rb") as handle:
        content = handle.read()

    size = len(content)
    bytes_as_int = ", ".join(str(byte) for byte in content)
    symbol = name.upper()

    cg.add_global(
        cg.RawExpression(
            "namespace esphome::web_assets { "
            f"extern const uint8_t WELAN_{symbol}[{size}] PROGMEM = {{{bytes_as_int}}}; "
            "}"
        )
    )
    cg.add_global(
        cg.RawExpression(
            "namespace esphome::web_assets { "
            f"extern const size_t WELAN_{symbol}_SIZE = {size}; "
            "}"
        )
    )


@coroutine_with_priority(CoroPriority.WEB + 1.0)
async def to_code(config):
    add_binary_resource("index_html_gz", config[CONF_INDEX_HTML])
    add_binary_resource("app_css_gz", config[CONF_APP_CSS])
    add_binary_resource("app_js_gz", config[CONF_APP_JS])

    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
