

/**
 * 基于一个vue组件·创建一个模态框
 * @param Component 弹框组件
 * @param config 传递的数据，通过data将数据传递给子组件
 * @example
 *  const result = await modalLoader(selectLinkDialog, {
        data: { ifSystem }
    });

    // onOK会走到此处，此时result就是对话框返回的内容
    this.homePage.page_type = result.page_type || "0";
    this.homePage.page_title = result.page_title;
    this.homePage.ifSystem = !!ifSystem;
    this.homePage.id = result.id
    this.homePage.url = result.link
 */
declare function modalLoader(Component: any, config: {
    /**
     * 如果有需要入参，请设置该字段
     */
    data: object,
}): Promise<any>

export default modalLoader