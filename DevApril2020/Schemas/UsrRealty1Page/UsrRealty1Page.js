define("UsrRealty1Page", ["RightUtilities"], function(RightUtilities) {
	return {
		entitySchemaName: "UsrRealty",
		attributes: {
			"PriceIsEditable": {
				"dataValueType": this.Terrasoft.DataValueType.BOOLEAN,
				"value": true
			},
			"UsrCommissionUSD": {
                // Массив конфигурационных объектов, определяющих зависимости колонки [UsrCommissionUSD].
                dependencies: [
                    {
                        // Значение колонки [UsrCommissionUSD] зависит от значений колонок [UsrPriceUSD] 
                        // и [UsrOfferType].
                        columns: ["UsrPriceUSD", "UsrOfferType"],
                        // Метод-обработчик, который вызывается при изменении значения одной из колонок [UsrPriceUSD] 
                        // и [UsrOfferType].
                        methodName: "calculateCommission"
                    }
                ]
            },
			"UsrOfferType": {
				lookupListConfig: {
					columns: ["UsrCommissionCoeff"]
				}
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrRealtyFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrRealty"
				}
			},
			"UsrSchemab892bd01Detailda320671": {
				"schemaName": "UsrRealtyVisitDetail",
				"entitySchemaName": "UsrRealtyVisit",
				"filter": {
					"detailColumn": "UsrRealty",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrEmployee": {
				"15ac1570-401e-4299-8000-cf9d62363802": {
					"uId": "15ac1570-401e-4299-8000-cf9d62363802",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			},
			"UsrPriceUSD": {
				"8f6bffa7-bbd7-4c7e-bfae-f145ada4ee47": {
					"uId": "8f6bffa7-bbd7-4c7e-bfae-f145ada4ee47",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 1,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "PriceIsEditable"
							},
							"rightExpression": {
								"type": 0,
								"value": true,
								"dataValueType": 12
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			positiveValueValidator: function(value, column) {
				let msg = "";
				if (value < 0) {
					msg = this.get("Resources.Strings.ValueMustBePositive");
				}
				return {
					invalidMessage: msg
				};
			},
            setValidationConfig: function() {
                // Вызывает инициализацию валидаторов родительской модели представления.
                this.callParent(arguments);
                this.addColumnValidator("UsrPriceUSD", this.positiveValueValidator);
                this.addColumnValidator("UsrAreaM2", this.positiveValueValidator);
            },
			
			calculateCommission: function() {
				var price = this.get("UsrPriceUSD");
				var offerTypeObject = this.get("UsrOfferType");
				var coeff = 0;
				if (offerTypeObject) {
					coeff = offerTypeObject.UsrCommissionCoeff;
					/*var offerTypeId = offerTypeObject.value; // displayValue
					var saleOfferTypeId = "daffd129-784b-4c82-ad18-4e3c00401693";
					if (offerTypeId == saleOfferTypeId) {
						coeff = 0.02;
					} else {
						coeff = 0.5;
					}*/
				}
				var commission = price * coeff;
				this.set("UsrCommissionUSD", commission);				
			},
			
			onEntityInitialized: function() {
				this.callParent(arguments);
				this.setPriceEditable();
				this.calculateCommission();
			},
			
			setPriceEditable: function() {
				if (this.isEditMode()) {
					RightUtilities.checkCanExecuteOperation({
						operation: "CanEditRealtyPrice"
					}, function(result) {
						this.set("PriceIsEditable", result);
					}, 
					this);
				}
			},
			
			myButtonClick: function() {
				var price = this.get("UsrPriceUSD");
				var kZTRate = 432;
				var amount = price * kZTRate;
				this.showInformationDialog("Цена в KZT: " + amount);
				this.console.log("MyButton pressed.");
			},
			getMyButtonEnabled: function() {
				var result = true;
				if (this.get("UsrPriceUSD") <= 0) {
					result = false;	
				}
				return result;
			}
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName4ece5a09-99ea-49e4-bd84-8148cb6150c6",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FLOATb3fa9b93-7e83-4f4e-be87-580e220b56cb",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPriceUSD",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FLOATacb84c3e-6a6b-4b70-85b7-43def07117bd",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrAreaM2",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.MyButtonCaption"
					},
					"click": {
						"bindTo": "myButtonClick"
					},
					"enabled": {
						"bindTo": "getMyButtonEnabled"
					},
					"style": "red",
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					}
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "FLOAT9287e9b5-a0e9-4e8f-8ded-33e77b877daa",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCommissionUSD",
					"enabled": false
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "LOOKUPc87928b4-4511-43b3-b711-7cf7eec5b726",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "LOOKUPa60f4d6d-c1bd-4f0f-b6bf-bd49adcce77e",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrOfferType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUP3b167053-d878-4682-8625-9781328e7e22",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrOwner",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUP68bd85e0-4818-4d12-b0a5-7fdee703325f",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrEmployee",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "STRINGe30dd8cf-df70-44c6-98fe-2978add7923b",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 2,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"tip": {
						"content": {
							"bindTo": "Resources.Strings.STRINGe30dd8cfdf7044c698fe2978add7923bTip"
						}
					},
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "Tab1b5e1f74TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab1b5e1f74TabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchemab892bd01Detailda320671",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab1b5e1f74TabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
