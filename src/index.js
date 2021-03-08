import { name, version } from "../goosemodModule.json";

let settings = {
  null: true,
};

let styleNull;

function updateSetting(setting, value = settings[setting]) {
  try {
    settings[setting] = value;

    switch (setting) {
      case "null":
        try {
          styleNull.remove();
        } catch {}

        if (value) {
          styleNull = document.createElement("style");
          styleNull.textContent = ``;
          document.head.appendChild(styleNull);
        }
        break;

      default:
        goosemodScope.showToast(`Setting "${setting}" not found.`, {
          type: "error",
        });
        break;
    }
  } catch (error) {
    goosemodScope.logger.debug(name, error);
    goosemodScope.showToast(
      `Failed to set setting "${setting}" to "${value}".`,
      {
        type: "error",
      }
    );
  }
}

function updateSettings(value) {
  for (const setting in settings) {
    updateSetting(setting, value);
  }
}

let style;

export default {
  goosemodHandlers: {
    onImport: async () => {
      style = document.createElement("style");
      style.textContent = `@import "https://raw.githack.com/TheRealGWJosh/CustomUserTags/main/main/main.css"`;
      document.head.appendChild(style);

      updateSettings();

      goosemodScope.settings.createItem(name, [
        `(v${version})`,
        {
          type: "header",
          text: "Coming soon",
        },
        {
          type: "toggle",
          text: "null",
          subtext:
            "This doesn't do anything, it's just here for when this module gets settings in the future.",
          onToggle: (value) => updateSetting("null", value),
          isToggled: () => settings.null,
        },
      ]);
    },

    getSettings: () => [settings],
    loadSettings: ([_settings]) => {
      settings = _settings;

      updateSettings();
    },

    onRemove: async () => {
      goosemodScope.settings.removeItem(name);
      updateSettings(false);
      style.remove();
    },
  },
};
