import { CustomElement } from '../../custom-elements/custom-element';
import { createFontAwesomeIcon } from '../../custom-elements/font-awesome-icon/font-awesome-icon';
import { createElement } from '../../dom';
import { assertUnreachable } from '../../utils';

import './features-info-popup.scss';

type FeatureStatus = 'active' | 'inactive' | 'failed';

class FeatureEntryElement implements CustomElement {
  public element = createElement({
    type: 'div',
    class: 'tt-feature-status-container',
    children: [
      this.createStatusElement('inactive'),
      createElement({
        type: 'span',
        children: [this.featureDescription]
      })
    ]
  });

  constructor(public featureId: string, private featureDescription: string) {}

  public updateStatus(status: FeatureStatus) {
    this.element.replaceChild(
      this.createStatusElement(status),
      this.element.children[0]
    );
  }

  private createStatusElement(status: FeatureStatus): HTMLElement {
    if (status === 'active') {
      return createFontAwesomeIcon('check', 'tt-active-feature');
    } else if (status === 'inactive') {
      return createFontAwesomeIcon('times-circle', 'tt-inactive-feature');
    } else if (status === 'failed') {
      return createFontAwesomeIcon('times-circle', 'tt-failed-feature');
    } else {
      return assertUnreachable(status);
    }
  }
}

export class FeaturesStatusPopup implements CustomElement {
  private renderedFeatures = new Map<string, FeatureEntryElement>();
  private featuresContentArea = createElement({
    type: 'div',
    class: 'tt-features-status-content',
    children: []
  });
  public element = createElement({
    type: 'div',
    class: 'tt-features-status',
    children: [
      createElement({
        type: 'div',
        class: 'tt-features-status-header',
        children: [
          createElement({
            type: 'span',
            children: ['TornTools features']
          }),
          createFontAwesomeIcon('caret-down')
        ]
      }),
      this.featuresContentArea
    ]
  });

  public addFeature(featureId: string, description: string) {
    const featureElem = new FeatureEntryElement(featureId, description);
    this.featuresContentArea.appendChild(featureElem.element);
    this.renderedFeatures.set(featureId, featureElem);
  }

  public updateFeatureStatus(featureId: string, status: FeatureStatus): void {
    if (!this.renderedFeatures.has(featureId)) {
      throw new Error(
        `[Error][TornTools] No feature id found to toggle status for with id ${featureId}`
      );
    }

    this.renderedFeatures.get(featureId)!.updateStatus(status);
  }
}
