# PCF FluentUI Autocomple Boilerplate.

Dynamics365 / PowerApps PCF Control boilerplate to create a Dynamic lookup from any api source. This is a boilerplate only and you will need to edit the api endpoint to a data point of your choosing.  The API I have used in this example will need an api key before it will work, but this is designed to give you an example.

The object of the project was to have a dynamic api lookup built on React and is styled to replicate out of the box components from Microsoft. 

This example has alot of console.debug values being pumped out, feel free to remove these for your production component.

![](./PCFFluentUiAutoComplete/img/preview.png)

---

## How to obtain an NZBN Api Key for this project as is.
You will need to obtain a token from the [https://api.business.govt.nz](https://api.business.govt.nz) first.

The auto complete will populate only the primary bound field, it is expected that you build this project out to fit your needs, personally I only store a minimum amount of data using this PCF control, and the rest of the data is populated nightly via a MS Flow that check the status of all companies stored in our Dynamics Instance.

---

## ToDo List
- [ ] Fix issue with multipul re-draws
- [ ] Fix issue with clear function, works but need to hit twice.
- [ ] Fix CSS for animated underline (anyone one know how to do this let me know, not a css expert.)

---

## Depercated PCF Controls.
[PCF-NZPost-AutoComplete](https://github.com/garethcheyne/PCF-NZPost-AutoComplete)

[PCF-NZBN-AutoComplete](https://github.com/garethcheyne/PCF-NZBN-AutoComplete)

---

### Disclaimer
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.