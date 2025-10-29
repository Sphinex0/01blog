import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

export class CustomUrlSerializer implements UrlSerializer {
  private defaultSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    // Encode parentheses before letting the default serializer handle it.
    const newUrl = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
    return this.defaultSerializer.parse(newUrl);
  }

  serialize(tree: UrlTree): string {
    // Use the default serializer to generate the URL string.
    // Then, decode the parentheses back to their original form for a cleaner URL in the browser's address bar.
    return this.defaultSerializer.serialize(tree).replace(/%28/g, '(').replace(/%29/g, ')');
  }
}