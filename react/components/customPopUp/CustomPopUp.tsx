import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './customPopUp.css';

interface SkuList {
  skuID: number;
  collectionID: number;
}

interface CustomPopUpProps {
  skuList: SkuList[];
  textPopUp: string;
  timePopUp: number;
  activePopUp: boolean;
}

interface CustomPopUpType extends React.FC<CustomPopUpProps> {
  schema: object;
}

const CSS_HANDLES = ['popUpContainer', 'popUp', 'closeButton', 'popUpText'] as const;

const CustomPopUp: CustomPopUpType = ({ skuList, textPopUp, timePopUp, activePopUp }) => {
  const productContextValue = useProduct();
  const [isVisible, setIsVisible] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const handles = useCssHandles(CSS_HANDLES);

  const currentSkuID = Number(productContextValue?.selectedItem?.referenceId?.[0]?.Value);


  useEffect(() => {
    if (activePopUp) {
      console.log("Current SKU ID:", currentSkuID);
      const skuData = skuList.find(sku => sku.skuID === currentSkuID);

      if (skuData) {
        console.log("Collection ID:", skuData.collectionID);
        setCollectionId(skuData.collectionID.toString());
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, timePopUp * 1000);

        return () => clearTimeout(timer);
      }
    }
    return () => {};
  }, [activePopUp, timePopUp, currentSkuID, skuList]);

  const handleClose = () => {
    setIsVisible(false);
  };


  if (!isVisible) return null;

  return (
    <div className={handles.popUpContainer}>
      <div className={handles.popUp}>
        <button onClick={handleClose} className={handles.closeButton}>x</button>
        <p className={handles.popUpText}>{textPopUp}</p>
        <a href={`/${collectionId}?map=productClusterIds`}>ver producto</a>
      </div>
    </div>
  );
};

CustomPopUp.schema = {
  title: 'Custom Pop Up',
  type: 'object',
  properties: {
    textPopUp: {
      title: 'Text Pop Up',
      type: 'string',
      description: 'Please enter the pop up text'
    },
    timePopUp: {
      title: 'Time Pop Up (in seconds)',
      type: 'number',
      description: 'Time in seconds before the pop up appears',
      default: 2
    },
    activePopUp: {
      title: 'Active Pop Up',
      type: 'boolean',
      description: 'Toggle to activate the pop up'
    },
    skuList: {
      title: 'Sku ID',
      type: 'array',
        items: {
          properties: {
            skuID: {
              title: 'Sku ID',
              type: 'number',
              description: 'Sku ID'
            },
            collectionID: {
              title: 'Collection ID',
              type: 'number',
              description: 'Collection ID'
            }
          }
        },
      description: 'Sku ID'
    }
  }
};

export default CustomPopUp;
