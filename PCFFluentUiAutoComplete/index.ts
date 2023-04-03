import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FluentUIAutoComplete, FluentUIAutoCompleteProps } from './tsx/AutoComplete';

export class PCFFluentUiAutoComplete implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;
	private _props: FluentUIAutoCompleteProps = {
		updateValue: this.updateValue.bind(this),
	}
	public _value: string | undefined
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {

		console.debug("PCF FluentUI AutoComplete - index.ts init")
		this._notifyOutputChanged = notifyOutputChanged;
		this._container = container;

	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public async updateView(context: ComponentFramework.Context<IInputs>) {
		// Add code to update control view

		this._props.context = context;
		this._props.isDisabled = context.mode.isControlDisabled;
		//this._props.apiToken = context.parameters.apiToken.raw || ""  // Uncomment for production use.
		this._props.apiToken = "993dae37883a4339908d090741a73568" // Testing Only remove for production, NB this token has been destroyed.

		this._props.value = context.parameters.value.raw || ""


		console.debug("PCF FluentUI AutoComplete - index.ts updateView")

		ReactDOM.render(
			React.createElement(
				FluentUIAutoComplete,
				this._props
			),
			this._container
		);
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		console.debug("PCF FluentUI AutoComplete - index.ts getOutputs value: ", this._value)
		return {
			value: this._value,
		};
	}

	private updateValue(entity: any) {
		console.debug("PCF FluentUI AutoComplete - index.ts updateValue", entity)
		if (entity != "") {
			this._value = entity?.entityName
			// Other Values that are required for component

		}
		else {
			this._value = ""
			this._props.value = ""
		}

		this._notifyOutputChanged();
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._container);
	}
}
