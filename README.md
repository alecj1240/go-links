# My Go Links Chrome Extension

This is a personal Chrome extension for managing and using custom Go Links. Go Links are short, memorable URLs that redirect to longer, often-used web addresses. They're commonly used in tech companies to make navigation easier and quicker.

For example, instead of typing out "https://calendar.google.com" every time you want to check your schedule, you can simply type "go/calendar" in your browser's address bar, and the extension will take you straight there!

## Features

- **Quick Access to Favorite Links**: Instead of remembering long URLs, use simple keywords to access your favorite websites.
- **Customizable**: Add your own Go Links by editing the `goLinks` object in the code.
- **Free and Private**: Unlike some services that charge for Go Links, this extension is completely free and private to you.

### Example Go Links

- `go/calendar` -> [Google Calendar](https://calendar.google.com)
- `go/docs` -> [Google Docs](https://docs.google.com)
- `go/github` -> [GitHub](https://github.com)

## Installation

1. **Clone or download this repository** to your local machine.

2. **Open Chrome** and go to `chrome://extensions/`.

3. **Enable Developer Mode** by toggling the switch in the top right corner.

4. Click on **Load unpacked** and select the folder where you cloned or downloaded the repository.

5. The extension should now appear in your list of Chrome extensions.

## Usage

1. **Type "go/" followed by your keyword** (e.g., `go/calendar`) into the Chrome address bar and press enter.

2. The extension will redirect you to the associated URL.

## Customizing Your Go Links

To customize or add your own Go Links:

1. Open the `background.js` file in the extension folder.
2. Modify the `goLinks` object to include your own short links and their corresponding URLs.

Example:

```javascript
const goLinks = {
  "calendar": "https://calendar.google.com",
  "github": "https://github.com/",
  "mycustomlink": "https://example.com",
  // Add more links here
};
```

3. Save the changes, and click the refresh icon in `chrome://extensions/` and your new links will be active.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
