import { observer } from "mobx-react"
import * as React from "react"
import * as syncify_mobx from "./syncify_mobx"

interface Props {
  fallback: React.ReactNode
  children: () => React.ReactNode
}

@observer
export class SyncifyReactComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    if (typeof this.props.children !== "function")
      throw new Error(
        "You must wrap <Syncify/> children in a function: <Syncify>{() => 'foo'}</Syncify>"
      )
  }

  private _render = syncify_mobx.toObservableValue(
    () => this.props.children(),
    this.props.fallback
  )

  render() {
    return <>{this._render.get()}</>
  }
}
