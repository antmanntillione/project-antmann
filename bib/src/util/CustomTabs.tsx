import React from "react";
import PropTypes from "prop-types";

import { useUncontrolled } from "uncontrollable";

import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import NavItem from "react-bootstrap/NavItem";
import TabContainer from "react-bootstrap/TabContainer";
import TabContent from "react-bootstrap/TabContent";
import TabPane from "react-bootstrap/TabPane";

import { forEach, map } from "react-bootstrap/ElementChildren";
import { SelectCallback, TransitionType } from "react-bootstrap/helpers";

/**
 * We fork Bootstraps Tabs Component to modify the TabContent Field and make it overflow
 */

export interface TabsProps extends React.PropsWithChildren<unknown> {
  activeKey?: unknown;
  defaultActiveKey?: unknown;
  onSelect?: SelectCallback;
  variant?: "tabs" | "pills";
  transition?: TransitionType;
  id?: string;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const propTypes = {
  /**
   * Mark the Tab with a matching `eventKey` as active.
   *
   * @controllable onSelect
   */
  activeKey: PropTypes.any,
  /** The default active key that is selected on start */
  defaultActiveKey: PropTypes.any,

  /**
   * Navigation style
   *
   * @type {('tabs'| 'pills')}
   */
  variant: PropTypes.string,

  /**
   * Sets a default animation strategy for all children `<TabPane>`s.
   * Defaults to `<Fade>` animation, else use `false` to disable or a
   * react-transition-group `<Transition/>` component.
   *
   * @type {Transition | false}
   * @default {Fade}
   */
  transition: PropTypes.oneOfType([
    PropTypes.oneOf([false]),
    PropTypes.elementType,
  ]),

  /**
   * HTML id attribute, required if no `generateChildId` prop
   * is specified.
   *
   * @type {string}
   */
  id: PropTypes.string,

  /**
   * Callback fired when a Tab is selected.
   *
   * ```js
   * function (
   *   Any eventKey,
   *   SyntheticEvent event?
   * )
   * ```
   *
   * @controllable activeKey
   */
  onSelect: PropTypes.func,

  /**
   * Wait until the first "enter" transition to mount tabs (add them to the DOM)
   */
  mountOnEnter: PropTypes.bool,

  /**
   * Unmount tabs (remove it from the DOM) when it is no longer visible
   */
  unmountOnExit: PropTypes.bool,
};

const defaultProps = {
  variant: "tabs",
  mountOnEnter: false,
  unmountOnExit: false,
};

function getDefaultActiveKey(children: React.ReactNode) {
  let defaultActiveKey: any;
  forEach(children, (child) => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey;
    }
  });

  return defaultActiveKey;
}

function renderTab(child: React.ReactElement) {
  const { title, eventKey, disabled, tabClassName, id } = child.props;
  if (title == null) {
    return null;
  }

  return (
    <NavItem
      as={NavLink}
      eventKey={eventKey}
      disabled={disabled}
      id={id}
      className={tabClassName}
    >
      {title}
    </NavItem>
  );
}

const Tabs = (props: TabsProps) => {
  const {
    id,
    onSelect,
    transition,
    mountOnEnter,
    unmountOnExit,
    children,
    activeKey = getDefaultActiveKey(children),
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: "onSelect",
  });

  return (
    <TabContainer
      id={id}
      activeKey={activeKey}
      onSelect={onSelect}
      transition={transition}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
    >
      <Nav {...controlledProps} role="tablist" as="nav">
        {map(children, renderTab)}
      </Nav>

      <TabContent className="overflow-auto scrollbar-gutter">
        {map(children, (child) => {
          const childProps = { ...child.props };

          delete childProps.title;
          delete childProps.disabled;
          delete childProps.tabClassName;

          return <TabPane {...childProps} />;
        })}
      </TabContent>
    </TabContainer>
  );
};

Tabs.propTypes = propTypes as any;
Tabs.defaultProps = defaultProps as any;
Tabs.displayName = "Tabs";

export default Tabs;
