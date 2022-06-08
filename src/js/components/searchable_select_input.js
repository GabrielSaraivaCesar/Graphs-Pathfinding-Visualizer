

class SearchableSelectInput extends HTMLElement {
    value = "";
    displayValue = "";
    label = "";
    options = [];

    searchValue = "";
    disabled = false;

    static get observedAttributes() { return ['label', 'options', 'value', 'disabled']; }

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const wrapper = document.createElement("div");
        wrapper.classList = ['searchable-select']

        const inputWrapper = document.createElement("div");
        wrapper.appendChild(inputWrapper);
        inputWrapper.classList = ["input"];

        const label = document.createElement("label");
        inputWrapper.appendChild(label);
        const labelSpan = document.createElement("span");
        label.appendChild(labelSpan);
        labelSpan.innerText = this.getAttribute("label");

        const input = document.createElement("input");
        label.appendChild(input);
        input.placeholder = "Search...";
        input.onblur = () => {
            this.updateInputValue();
            this.searchValue = "";
        }
        input.oninput = () => {
            this.searchValue = this._removeSpecialChars(input.value.toUpperCase());
            this.loadOptions();
        }
        input.onfocus = (e) => {
            if (this.disabled) {
                input.blur();
                return;
            }
            this.loadOptions();
            input.setSelectionRange(0, input.value.length, "forward");
        }

        const searchBoxWrapper = document.createElement("div");
        wrapper.appendChild(searchBoxWrapper)
        searchBoxWrapper.classList = ['search-options'];

        
        const style = document.createElement("style");
        style.textContent = `
        .searchable-select {
            position: relative;
        }
        
        .searchable-select .input:focus-within ~ .search-options, .searchable-select .search-options:active{
            display: flex;
        }
        .searchable-select .search-options {
            position: absolute;
            width: 100%;
            max-height: 300px;
            top: 55px;
            border-radius: 5px;
            background-color: #EFEFEF;
            border: 1px solid #D2D2D2;
            display: none;
            flex-direction: column;    
            overflow: hidden;
            overflow-y: scroll;
        }
        .searchable-select .search-options .search-option {
            width: 100%;
            padding: 10px;
            cursor: pointer;
            transition: 0.2s;
        }
        .searchable-select .search-options .search-option:hover {
            background-color: #f5f5f5;
        }
        .input {
            width: 100%;
            height: 50px;
        
            background: #EFEFEF;
            border: 1px solid #D2D2D2;
            border-radius: 5px;
            position: relative;
            transition: 0.15s;
        }
        .input label {
            top: 8px;
            left: 8px;
            position: absolute;
            
            font-style: normal;
            font-weight: 700;
            font-size: 12px;
            line-height: 12px;
        
            color: #7D7D7D;
        }
        .input input {
            background-color: transparent;
            border: none;
            width: 100%;
            height: 100%;
            outline: none;
            padding: 2px 8px 8px 0;
        }
        .input:focus-within {
            border-color: #008CC1;
            border-width: 1.5px;
        }
        .input:focus-within label {
            color: #008CC1;
        }
        `;
        this.shadowRoot.append(style, wrapper);
        this.loadOptions();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label") {
            this.label = newValue;
            this.shadowRoot.querySelector("label span").innerText = newValue;
        } else if (name === "options") {
            this.options = JSON.parse(newValue);
            this.loadOptions();
            this.options.forEach(opt => {
                if (opt.value === this.value) {
                    this.displayValue = opt.label;
                }
            })
            this.updateInputValue();
        } else if (name === "value") {
            this.value = newValue;
            this.options.forEach(opt => {
                if (opt.value === newValue) {
                    this.displayValue = opt.label;
                }
            })
            this.updateInputValue();
        } else if (name === "disabled") {
            this.disabled = newValue !== null;
            this._updateDisabledStyle();
        }
    }

    _updateDisabledStyle() {
        if (this.disabled) {
            this.shadowRoot.querySelector(".input").style.background = "#d2d2d2";
            this.shadowRoot.querySelector(".input input").style.cursor = "default";
        }
        else {
            this.shadowRoot.querySelector(".input").style = "";
        }
    }

    _removeSpecialChars(v) {
        return v.replace(/[\\\/\-\@\!\#\$\%\^\&\*\(\)\+\=\_\`\~\[\]\{\}\'\"\;\:\?\.\,\<\>]/g, "");
    }

    loadOptions() {
        const searchBoxWrapper = this.shadowRoot.querySelector('.search-options');
        searchBoxWrapper.innerHTML = ""; // Clear content
        let filteredOptions = this.options.filter(opt => {
            if (
                this._removeSpecialChars(opt.label.toUpperCase()).includes(this.searchValue) || 
                this._removeSpecialChars(opt.value.toUpperCase()).includes(this.searchValue)
            ) {
                return true;
            }
            return false;
        });

        filteredOptions.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.classList = ['search-option'];
            optionElement.innerText = option.label;
            optionElement.onclick = () => {
                this.value = option.value;
                this.displayValue = option.label;
                this.updateInputValue();
            }
            searchBoxWrapper.appendChild(optionElement);
        })
    }

    updateInputValue() {
        const input = this.shadowRoot.querySelector("input");
        input.value = this.displayValue;
        this.searchValue = "";
    }

}

window.customElements.define('searchable-select-input', SearchableSelectInput);